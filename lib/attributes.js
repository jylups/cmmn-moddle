/**
 * White space around the "=" of an attribute.
 *
 * XML allows white space on both sides of the "=" of an attribute
 * (`Eq ::= S? '=' S?`), and Flowable reads such attributes, but the XML
 * parser of moddle-xml (saxen) does not: it reports the element as
 * unparsable, and its attributes are lost.
 *
 * Until saxen reads them, the white space around "=" in start tags is moved
 * behind the attribute value before parsing. The document keeps its length
 * and its line breaks, so positions in import warnings stay right.
 */


var GT = 62, // >
    EQ = 61, // =
    QUOT = 34, // "
    APOS = 39, // '
    BANG = 33, // !
    QUESTION = 63, // ?
    SLASH = 47, // /
    OPEN_BRACKET = 91, // [
    CLOSE_BRACKET = 93; // ]


function isWhitespace(code) {
  return code === 32 || code === 9 || code === 10 || code === 13;
}


/**
 * The index after the end of markup that is not a start tag (a comment,
 * CDATA section, processing instruction, declaration or end tag) that
 * starts at the given index, or -1 when the markup is a start tag.
 */
function skipOtherMarkup(xml, start) {
  var next = xml.charCodeAt(start + 1),
      end;

  if (next === BANG) {

    if (xml.startsWith('<!--', start)) {
      end = xml.indexOf('-->', start + 4);

      return end === -1 ? xml.length : end + 3;
    }

    if (xml.startsWith('<![CDATA[', start)) {
      end = xml.indexOf(']]>', start + 9);

      return end === -1 ? xml.length : end + 3;
    }

    // a declaration such as <!DOCTYPE>, with a possible internal subset
    return skipDeclaration(xml, start + 2);
  }

  if (next === QUESTION) {
    end = xml.indexOf('?>', start + 2);

    return end === -1 ? xml.length : end + 2;
  }

  if (next === SLASH) {
    end = xml.indexOf('>', start + 2);

    return end === -1 ? xml.length : end + 1;
  }

  return -1;
}

function skipDeclaration(xml, i) {
  var depth = 0,
      quote = 0,
      code;

  for (; i < xml.length; i++) {
    code = xml.charCodeAt(i);

    if (quote) {
      if (code === quote) {
        quote = 0;
      }
    } else if (code === QUOT || code === APOS) {
      quote = code;
    } else if (code === OPEN_BRACKET) {
      depth++;
    } else if (code === CLOSE_BRACKET) {
      depth--;
    } else if (code === GT && depth <= 0) {
      return i + 1;
    }
  }

  return xml.length;
}


/**
 * Move the white space around the "=" of the attributes of a start tag
 * behind their values.
 *
 * @param {string} xml
 * @param {number} start index of the "<" of the start tag
 * @param {Array<string>} out the parts of the result
 *
 * @return {number} the index after the start tag
 */
function normalizeStartTag(xml, start, out) {
  var l = xml.length,
      i = start,
      code,
      ws,
      wsEnd,
      quote,
      valueEnd,
      moved;

  while (i < l) {
    code = xml.charCodeAt(i);

    if (code === GT) {
      out.push('>');

      return i + 1;
    }

    // an attribute value outside of an attribute, for example in malformed
    // markup; copied as is
    if (code === QUOT || code === APOS) {
      valueEnd = xml.indexOf(String.fromCharCode(code), i + 1);
      valueEnd = valueEnd === -1 ? l : valueEnd + 1;

      out.push(xml.substring(i, valueEnd));
      i = valueEnd;

      continue;
    }

    if (isWhitespace(code)) {

      // white space before a "=" is moved behind the value
      for (wsEnd = i; wsEnd < l && isWhitespace(xml.charCodeAt(wsEnd)); wsEnd++);

      if (xml.charCodeAt(wsEnd) !== EQ) {
        out.push(xml.substring(i, wsEnd));
        i = wsEnd;

        continue;
      }

      ws = xml.substring(i, wsEnd);
      i = wsEnd;
    } else {
      ws = '';
    }

    if (xml.charCodeAt(i) !== EQ) {
      out.push(xml.charAt(i));
      i++;

      continue;
    }

    // "=", and the white space after it
    for (wsEnd = i + 1; wsEnd < l && isWhitespace(xml.charCodeAt(wsEnd)); wsEnd++);

    moved = ws + xml.substring(i + 1, wsEnd);
    quote = xml.charCodeAt(wsEnd);

    if (quote !== QUOT && quote !== APOS) {

      // no quoted value; left to the parser to report
      out.push(ws, xml.substring(i, wsEnd));
      i = wsEnd;

      continue;
    }

    valueEnd = xml.indexOf(String.fromCharCode(quote), wsEnd + 1);

    if (valueEnd === -1) {
      out.push(ws, xml.substring(i));

      return l;
    }

    out.push('=', xml.substring(wsEnd, valueEnd + 1), moved);
    i = valueEnd + 1;
  }

  return l;
}


/**
 * Move the white space around the "=" of attributes in start tags behind
 * the attribute values, so the XML parser reads the attributes.
 *
 * @param {string} xml
 *
 * @return {string} the XML, unchanged when it has no such white space
 */
export function normalizeAttributeWhitespace(xml) {

  var out = [],
      changed = false,
      l = xml.length,
      i = 0,
      lt,
      end,
      tagOut;

  while (i < l) {
    lt = xml.indexOf('<', i);

    if (lt === -1) {
      out.push(xml.substring(i));
      break;
    }

    out.push(xml.substring(i, lt));

    end = skipOtherMarkup(xml, lt);

    if (end !== -1) {
      out.push(xml.substring(lt, end));
      i = end;

      continue;
    }

    tagOut = [];
    end = normalizeStartTag(xml, lt, tagOut);
    tagOut = tagOut.join('');

    if (tagOut !== xml.substring(lt, end)) {
      changed = true;
    }

    out.push(tagOut);
    i = end;
  }

  return changed ? out.join('') : xml;
}
