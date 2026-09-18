---
title: "Your Post Title Here"
slug: "your-post-title-here"
description: "A brief summary of the main topic or thesis of this post."
author:
  name: "Your Name"
  url: ""
  id: ""
date: "2026-09-18"
category: "web4"
tags:
  - web4
  - publishing
  - technology
theme: "default"
draft: false
mastodon:
  publish: true
  visibility: "public"
  hashtags:
    - Web4
    - Publishing
    - Technology
---
# Your Post Title Here
A brief introductory paragraph summarizing the main topic or thesis of
your post.
## Key Section Header
- **Point 1:** Description or explanation of the first key point.
- **Point 2:** Description or explanation of the second key point.
### Sub-section Title
Write your detailed content here.
You can include inline code such as `codeSnippet()`.
You can also include full code blocks:
```javascript
function helloWorld() {
  console.log("Hello from your new blog post!");
}
helloWorld();

Note: Standard Markdown blockquotes can be used for important
callouts, notes, warnings, or takeaways.

Another Section

Continue writing your publication here.

You can use:

* Lists
* Bold text
* Italic text
* inline code
* Links
* Images
* Tables
* Code blocks
* Blockquotes

Conclusion

Summarize the main ideas and explain the significance of the topic.

The important change is:
```yaml
author:
  name: "Your Name"
  url: ""
  id: ""

That gives web4-publisher a proper author object instead of a plain string.

The fields can later map cleanly to different publication systems:

author.name
    ↓
HTML author name
    ↓
RSS author
    ↓
Mastodon attribution
    ↓
JSON-LD author.name
author.url
    ↓
canonical author profile
    ↓
Web4 identity/profile
author.id
    ↓
stable author identifier
    ↓
LCT / decentralized identity / public key

I would keep url and id optional for now rather than inventing values. This makes the schema ready for Web4 identity without coupling the current publisher to a particular identity system.
