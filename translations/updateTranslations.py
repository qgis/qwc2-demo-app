#!/usr/bin/python
"""
This script extracts the subset of strings specified in the 'strings' file from
the original upstream translations


To find out which translations are needed, add

  console.log(this.props.msgId)

to MapStore2/web/client/components/i18N/Message.jsx@render

To add a new locale, just extent the langs list below
"""

import os
import json

langs = ["en-US", "fr-FR", "it-IT", "de-CH"]

wd = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(wd, 'strings')) as fh:
  paths = [string.split(".") for string in fh.read().split("\n") if string]

for lang in langs:
  # Upstream translation
  try:
    with open(os.path.join(wd, '..', 'qwc2', 'MapStore2', 'web', 'client', 'translations', 'data.' + lang)) as fh:
      origsrc = json.load(fh)
  except:
    origsrc = {"locale": lang, "messages": {}}

  # Local translation
  try:
    with open(os.path.join(wd, 'data.' + lang)) as fh:
      src = json.load(fh)
  except:
    src = {"locale": lang, "messages": {}}

  dst = {}
  for path in paths:
    # First, look for the string in the existing local translation
    srcitem = src["messages"]
    try:
      for part in path:
        srcitem = srcitem[part]
    except Exception, e:
      srcitem = ""

    # If missing, look for the string in the original upstream translation
    if not srcitem:
      srcitem = origsrc["messages"]
      try:
        for part in path:
          srcitem = srcitem[part]
      except Exception, e:
        srcitem = ""

    # Write string in destination translation
    dstitem = dst
    for part in path[:-1]:
      dstitem = dstitem.setdefault(part, {})
    dstitem[path[-1]] = srcitem

  with open(os.path.join(wd, 'data.' + lang), 'w') as fh:
    json.dump({"locale": lang, "messages": dst}, fh, sort_keys=True, indent=4, separators=(',', ': '))
