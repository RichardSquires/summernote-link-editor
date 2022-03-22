# summernote-link-editor v1.0.0
A plugin for the [Summernote](https://github.com/summernote/summernote/) WYSIWYG editor.

Allows creation of additional link types, the main purpose of starting this plugin is to allow easy email link editing.
The main link creation tab uses summernote existing language and functionality.

Example config:
```
toolbar: [
  ['font', ['bold', 'italic', 'underline']],
  ['para', ['ul', 'ol', 'paragraph']],
  ['color', ['color']],
  ['style', ['style']],
  ['insert', ['advLink', 'video']]//add new link button to insert menu group
],
popover: {
  link: [['link', ['editAdvLink', 'unlink']]]//add new link button for the edit pop over
}
```

## Buttons ##
### editAdvLink ###
"editAdvLink" button is designed for the link popover
### advLink ###
"advLink" button is design for the toolbar
