/* https://github.com/RichardSquires/summernote-link-editor
 * Version: 1.0.0
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        factory(window.jQuery);
    }
}(function ($) {
    $.extend(true, $.summernote.lang, {
        'en-US': {
            linkEditor: {
                email: "Email",
                address: "Email address",
                subject: "Subject line",
                body: "Body text"
            }
        }
    });
    $.extend($.summernote.options, {
        linkEditor: {
            tabsEnabled: ['link', 'email']
        }
    });
    $.extend($.summernote.plugins, {
        'linkEditor': function (context) {
            var self = this,
                ui = $.summernote.ui,
                $note = context.layoutInfo.note,
                $editor = context.layoutInfo.editor,
                $editable = context.layoutInfo.editable,
                options = context.options,
                lang = options.langInfo;
            /*override keyboard mapping for links*/
            if(shouldInitialize()) {
                options.keyMap.pc['CTRL+K'] = 'linkEditor.show';
                options.keyMap.mac['CMD+K'] = 'linkEditor.show';
            }
            context.memo('button.advLink', function () {
                var button = ui.button({
                    contents: ui.icon(options.icons.link),
                    container: context.layoutInfo.editor[0],/*fix to allow tooltip to show*/
                    tooltip: lang.link.link,
                    click: function () {
                        context.invoke('linkEditor.show');
                    }
                });
                return button.render();
            });
            context.memo('button.editAdvLink', function () {
                var button = ui.button({
                    contents: ui.icon(options.icons.link),
                    container: context.layoutInfo.editor[0],/*fix to allow tooltip to show*/
                    tooltip: lang.link.edit,
                    click: function () {
                        context.invoke('linkEditor.show');
                    }
                });
                return button.render();
            });
            this.initialize = function () {
                var showLinkTab = options.linkEditor.tabsEnabled.indexOf("link") > -1;
                var showEmailTab = options.linkEditor.tabsEnabled.indexOf("email") > -1;
                /*create dialog*/
                var $container = options.dialogsInBody ? $(document.body) : $editor;
                /*header*/
                var header = 
                /*dialog nav*/
                '<div class="note-header">' +
                    '<ul class="nav note-nav nav-tabs note-nav-tabs">';
                if(showLinkTab)
                {
                    header += '<li class="nav-item note-nav-item note-nav-advlink-link">' +
                        '<a class="nav-link note-nav-link note-nav-advlink-link" data-toggle="link" href="JavaScript:void(null);">' + lang.link.insert + '</a>' +
                    '</li>';
                }
                if(showEmailTab)
                {
                    header += '<li class="nav-item note-nav-item note-nav-advlink-email">' +
                        '<a class="nav-link note-nav-link note-nav-advlink-email" data-toggle="email" href="JavaScript:void(null);">' + lang.linkEditor.email + '</a>' +
                    '</li>';
                }
                /*close header tags*/
                header += '</ul>' +
                '</div>';
                /*dialog contents*/
                var linkTab = 
                /*link tab*/
                '<div class="tab-content note-tab-content note-tab-link">' +
                    /*link title attribute*/
                    '<div class="note-form-group form-group note-group-link-title">' +
                        '<div class="input-group note-input-group col-xs-12 col-sm-9">' +
                            '<label class="control-label note-form-label col-sm-3">' + lang.link.textToDisplay + '</label>' +
                            '<input class="note-link-title form-control note-form-control note-input" type="text">' +
                        '</div>' +
                    '</div>' +

                    /*link href*/
                    '<div class="note-form-group form-group note-group-link-href">' +
                        '<div class="input-group note-input-group col-xs-12 col-sm-9">' +
                            '<label class="control-label note-form-label col-xs-3">' + lang.link.url + '</label>' +
                            '<input class="note-link-href form-control note-form-control note-input" type="text">' +
                        '</div>' +
                    '</div>' +
                    /*link target open in new window checkbox*/
                    '<div class="note-form-group form-group note-group-link-target-protocol" >' +
                        '<div class="input-group note-input-group checkbox col-xs-12 col-sm-9">' +
                            '<label>' +
                                '<input class="note-link-target" role="checkbox" type="checkbox" checked="" aria-checked="true" />' +
                                lang.link.openInNewWindow +
                            '</label>' +
                        '</div>' +
                    /*protocol checkbox*/
                        '<div class="input-group note-input-group checkbox col-xs-12 col-sm-9">' +
                            '<label>' +
                                '<input class="note-link-protocol" role="checkbox" type="checkbox" checked="" aria-checked="true" />' +
                                lang.link.useProtocol +
                            '</label>' +
                        '</div>' +
                    '</div>' +
                /* closing div for tab content*/
                '</div>';

                var emailTab = 
                /*email tab*/
                '<div class="tab-content note-tab-content note-tab-email">' +
                    /*email address*/
                    '<div class="note-form-group form-group note-group-link-email">' +
                        '<div class="input-group note-input-group col-xs-12 col-sm-9">' +
                            '<label class="control-label note-form-label col-sm-3">' + lang.linkEditor.address + '</label>' +
                            '<input class="note-link-email form-control note-form-control note-input" type="text">' +
                        '</div>' +
                    '</div>' +

                    /*email subject*/
                    '<div class="note-form-group form-group note-group-link-subject">' +
                        '<div class="input-group note-input-group col-xs-12 col-sm-9">' +
                            '<label class="control-label note-form-label col-xs-3">' + lang.linkEditor.subject + '</label>' +
                            '<input class="note-link-subject form-control note-form-control note-input" type="text">' +
                        '</div>' +
                    '</div>' +
                    /*email body*/
                    '<div class="note-form-group form-group note-group-link-target-protocol" >' +
                        '<div class="input-group note-input-group checkbox col-xs-12 col-sm-9">' +
                            '<label class="control-label note-form-label col-xs-3">' + lang.linkEditor.body + '</label>' +
                            '<textarea class="note-link-body form-control note-form-control note-input" style="resize: none;" rows="6">' +
                            '</textarea>' +
                        '</div>' +
                    '</div>' +
                /* closing div for tab content*/
                '</div>';

                var body = "";
                if(showLinkTab) { body += linkTab; }
                if(showEmailTab) { body += emailTab; }
                
                /*footer button*/
                var footerButton = '<button href="#" class="btn btn-primary note-btn note-btn-primary note-advLink-btn" disabled>' + lang.link.insert + '</button>';
                /*dialog*/
                this.$dialog = ui.dialog({
                    className: 'adv-link-dialog',
                    title: lang.link.insert,
                    body: header + body,
                    footer: footerButton,
                    callback: function($dialog) {
                        var $tabs = $dialog.find('.note-tab-content');
                        var $links = $dialog.find('.note-nav-link');
                        /*hide all tabs */
                        $tabs.hide();
                        /*Tab switching function*/
                        var tabSwitch = function($link) {
                            var tab = $link.data('toggle');
                            $tabs.hide();
                            $tabs.removeClass('active-tab-link');
                            $links.removeClass('active');

                            var $selTab = $dialog.find('.note-tab-' + tab);
                            $selTab.show();
                            $selTab.addClass('active-tab-link');
                            $link.addClass('active');
                        };
                        
                        $links.each(function(index, link) {
                            var $link = $(link);
                            /*run for first link */
                            if(index === 0) { tabSwitch($link); }
                            /*attach on click */
                            $link.click(function() {
                                tabSwitch($link);
                            });
                        });

                        /*generate email link on the fly */
                        var $url = $dialog.find('.note-link-href');
                        var $email = $dialog.find('.note-link-email');
                        var $subject = $dialog.find('.note-link-subject');
                        var $body = $dialog.find('.note-link-body');
                        var autoFillUrl = function() {
                            /*check fields have been filled out */
                            if($email.val().length === 0
                                && $subject.val().length === 0
                                && $body.val().length === 0)
                            {
                                /*if not cancel processing and wipe any existing mailto link */
                                if($url.val().indexOf('mailto:') > -1) { $url.val(''); }
                                return;
                            }
                            /*create link */
                            if($url.val() == '' || !$url.val().startsWith('mailto:')) {
                                var link = 'mailto:'.concat(encodeURIComponent($email.val()));
                                if($subject.val().length > 0)
                                {
                                    link += '?subject='.concat(encodeURIComponent($subject.val()));
                                }
                                if($body.val().length > 0)
                                {
                                    var paramJoin = link.indexOf('?') > -1 ? '&' : '?';
                                    link += paramJoin.concat(encodeURIComponent($body.val()));
                                }
                                $url.val(link);
                            } else {
                                /*else update link (preserves pasted ) */
                                var currentUrl= $url.val();
                                /*update or add subject */
                                var subjectWithVal = 'subject='.concat(encodeURIComponent($subject.val()));
                                var subjectRegEx = /(subject=.*?.&)/i /*subject param has surrounding parameters */
                                var subjectAtEndRegEx = /(subject=.*?$)/i
                                if(subjectRegEx.test(currentUrl)) {
                                    subjectWithVal = subjectWithVal.concat("&");
                                    currentUrl = currentUrl.replace(subjectRegEx, subjectWithVal);
                                } else if (subjectAtEndRegEx.test(currentUrl)) {
                                    currentUrl = currentUrl.replace(subjectAtEndRegEx, subjectWithVal);
                                } else if ($subject.val().length > 0) {
                                    var joinChar = currentUrl.indexOf('?') === -1 ? '?' : '&';
                                    currentUrl += joinChar.concat(subjectWithVal);
                                }

                                /*update or add body */
                                var bodyWithVal = 'body='.concat(encodeURIComponent($body.val()));
                                var bodyRegEx = /(body=.*?.&)/i /*body param has surrounding parameters */
                                var bodyAtEndRegEx = /(body=.*?$)/i
                                if(bodyRegEx.test(currentUrl)) {
                                    bodyWithVal = bodyWithVal.concat("&");
                                    currentUrl = currentUrl.replace(bodyRegEx, bodyWithVal);
                                } else if (bodyAtEndRegEx.test(currentUrl)) {
                                    currentUrl = currentUrl.replace(bodyAtEndRegEx, bodyWithVal);
                                } else if ($body.val().length > 0) {
                                    var joinChar = currentUrl.indexOf('?') === -1 ? '?' : '&';
                                    currentUrl += joinChar.concat(bodyWithVal);
                                }

                                /*Update email */
                                var emailInLink = /(:.*?\?)//*email to has surrounding parameters */
                                var endChar = '?';
                                if (currentUrl.indexOf('?') == -1) {
                                    /*email to has no parameters */
                                    emailInLink = /(:.*)/
                                    endChar = '';
                                }
                                currentUrl = currentUrl.replace(emailInLink, ":".concat(encodeURIComponent($email.val()),endChar))

                                $url.val(currentUrl);
                                $url.keyup();
                            }
                        };
                        $email.on('input paste propertychange', autoFillUrl);
                        $subject.on('input paste propertychange', autoFillUrl);
                        $body.on('input paste propertychange', autoFillUrl);

                        /*bind url to title inputs and enable/disable save button*/
                        var $title = $dialog.find('.note-link-title');
                        var checkFormValid = function() {
                            var isDisabled = $title.val().length === 0 && $url.val().length === 0
                            $dialog.find('.note-btn.note-advLink-btn').prop('disabled', isDisabled)
                        }
                        $url.on('input paste propertychange',function() {
                            var newText = $url.val()
                            var oldText = $title.val();
                            if(!$title.val() 
                                || $title.val() === newText.substring(0,newText.length - 1)
                                || oldText.substring(0, oldText.length - 1) === newText
                            ) {
                                $title.val(newText);
                            }
                            checkFormValid();
                        });
                        $title.on('input paste propertychange', checkFormValid);
                    }
                }).render().appendTo($container);
                
            };
            this.destroy = function () {
                ui.hideDialog(this.$dialog);
                this.$dialog.remove();
            };
            this.bindEnterKey = function ($input, $btn) {
                $input.on('keypress', function (e) {
                    if (e.keyCode === 13) $btn.trigger('click');
                });
            };
            this.show = function () {
                ui.showDialog(self.$dialog);
                /**function from built-in link editor, structure returned:
                 * range (summernote range)
                 * text
                 * url
                 * isNewWindow (bool)
                */
                var linkInfo = context.invoke('editor.getLinkInfo');
                this.showImageAttributesDialog(linkInfo).then(function (linkInfo) {
                    ui.hideDialog(self.$dialog);
                    /*update editable area*/

                    /*validate url (mirrors standard linking for consistency - v0.8.18)*/
                    if (linkInfo.url && typeof linkInfo.url === 'string') {
                        linkInfo.url = linkInfo.url.trim();

                        if (options.onCreateLink) {
                            linkUrl = options.onCreateLink(linkUrl);
                        } else if(linkInfo.checkProtocol) {
                            /*if url doesn't have any protocol and not even a relative or a label, use http:// as default*/
                            linkInfo.url = /^([A-Za-z][A-Za-z0-9+-.]*\:|#|\/)/.test(linkInfo.url) ? linkInfo.url : options.defaultProtocol.concat(linkInfo.url);
                        }
                    }
                    /*Use existing summernote insertion API to update/create links 
                     *(linkInfo needs to be consistent with system setup)
                     */
                    $note.summernote('createLink', linkInfo);

                });
            };
            this.showImageAttributesDialog = function (linkInfo) {
                return $.Deferred(function (deferred) {
                    var $title = self.$dialog.find('.note-link-title'),
                        $url = self.$dialog.find('.note-link-href'),
                        $newWindow = self.$dialog.find('.note-link-target'),
                        $defaultProtocol = self.$dialog.find('.note-link-protocol'),
                        $email = self.$dialog.find('.note-link-email'),
                        $subject = self.$dialog.find('.note-link-subject'),
                        $body = self.$dialog.find('.note-link-body'),
                        $editBtn = self.$dialog.find('.note-advLink-btn');

                    /*dialog ui functions*/
                    ui.onDialogShown(self.$dialog, function () {
                        context.triggerEvent('dialog.shown');
                        $editBtn.off();
                        $editBtn.one('click', function (e) {
                            e.preventDefault();
                            deferred.resolve({
                                range: linkInfo.range,
                                text: $title.val(),
                                url: $url.val(),
                                isNewWindow: $newWindow.prop('checked'),
                                checkProtocol: $defaultProtocol.prop('checked')
                            }).then(function (linkInfo) {
                                /*synch changes*/
                                context.triggerEvent('change', $editable.html());
                            });
                        });

                        /*setup form data from html*/
                        $title.val(linkInfo.text);
                        if(linkInfo.url) {
                            $url.val(linkInfo.url);
                            $newWindow.prop('checked', linkInfo.isNewWindow);
                            /*process mailto link */
                            if(linkInfo.url.indexOf('mailto:') > -1) {
                                var urlParts = linkInfo.url.split(/(mailto:|\?|&)/gi);
                                for (let partIndex = 0; partIndex < urlParts.length; partIndex++) {
                                    const part = urlParts[partIndex];
                                    const testPart = part.toLowerCase().trim();
                                    if(testPart === "mailto:") {
                                        $email.val(decodeURIComponent(urlParts[partIndex+1]));
                                        continue;
                                    }
                                    if(testPart.startsWith('subject=')) {
                                        var subject = part.replace('subject=', '');
                                        $subject.val(decodeURIComponent(subject));
                                        continue;
                                    }
                                    if(testPart.startsWith('body=') === 0) {
                                        var body = part.replace('body=', '');
                                        $body.val(decodeURIComponent(body));
                                        continue;
                                    }
                                }
                            }
                        } else {
                            /*if there is no link then reset form*/
                            $url.val("");
                            $newWindow.prop('checked', true);

                            $email.val("");
                            $subject.val("");
                            $body.val("");
                        }
                        
                        self.bindEnterKey($editBtn);
                    });
                    ui.onDialogHidden(self.$dialog, function () {
                        $editBtn.off('click');
                        if (deferred.state() === 'pending') deferred.reject();
                    });
                    ui.showDialog(self.$dialog);
                    
                });
            };
            //events for this plugin
            this.events = {
            }
            /*check we have enough tabs to be useful*/
            function shouldInitialize() {
                return options.linkEditor && options.linkEditor.tabsEnabled && options.linkEditor.tabsEnabled.length > 0;
            }
            this.shouldInitialize = shouldInitialize;
        }
    });
}));
