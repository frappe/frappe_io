---
add_breadcrumbs: 1
title: Translations
image: /assets/frappe_io/images/frappe-framework-logo-with-padding.png
metatags:
 description: >
  Learn how Frappe handles translations in code which has enabled it to be
  translated into more than 150 languages.
---

# Translations

Frappe comes with a built-in translation system for capturing translatable strings
from code and extracting them into CSV files for different languages.

## How it works

Translations happen in three steps.

### 1. Extracting translatable strings

Many strings like field `label` and `description` that are easily parseable from
JSON files of DocTypes are automatically marked as translatable without any
explicit hint.

Other strings are extracted from source code files such as `.json`, `.js`,
`.py`. These are extracted only if they are marked explicitly by the author in
`_()` or `__()` methods.

For example:

```py
message = _("You don't have permissions to access this file")
```

### 2. Translating the extracted strings

Once we have a list of strings that we want to translate, they are put into CSV
files based on the language. Translations are primarily contributed by various
users of Frappe and ERPNext on the [translator portal](https://translate.erpnext.com).

The submitted translations are verified and then converted into a [Pull Request](https://github.com/frappe/frappe/pull/7805/files)
by a bot every week and merged into the core.

### 3. Translating strings in app

Translations are nothing but a key-value pair made of original string and it's
translation in a language. It might look like this:

```js
{
	"1 hour ago": "एक घंटे पहले",
    "1 minute ago": "1 मिनट पहले",
    "1 month": "1 महीना",
    "1 week": "1 सप्ताह",
    "1 year": "1 साल",
    "3 months": "3 महीने",
    "6 months": "6 महीने",
    "About": "के बारे में",
    "About Us Settings": "हमारे बारे में सेटिंग्स",
    "About Us Team Member": "हमारे बारे में टीम के सदस्य",
    "Academic Term": "शैक्षणिक शब्द",
    "Academic Year": "शैक्षणिक वर्ष",
	"Academics User": "अकादमिक उपयोगकर्ता",
	...
}
```

When the string is written as `__('1 hour ago')` in the code, the `__` method
looks up the dictionary to find whether a translation exists for that string. If
yes, the translated string would be returned and it would show up.

This was an example of how translations work in JavaScript files, but the same
works in Python too.

## Tips on writing a valid translatable string

There are a few rules that need to be followed for the translation parser to
pick up the strings properly from code.

### 1. Literal strings

The string to be translated must always be a literal string, not a variable or
expression.

Example in Python

```py
# This will work
message = _('Document submitted successfully')
frappe.msgprint(message)

# This will also work
frappe.msgprint(_('Document submitted successfully'))

# This won't work
message = 'Document submitted successfully'
frappe.msgprint(_(message))
```

Example in JavaScript

```js
// This will work
message = __('Document submitted successfully')
frappe.msgprint(message)

// This won't work
message = 'Document submitted successfully'
frappe.msgprint(__(message))
```

### 2. Variables

If you have variables in your string, you must use the positional formatter
`{0}`, any other type of formatter won't work.

Example in Python

```py
# This is fine
_('Welcome {0}, get started with ERPNext in just a few clicks.').format(full_name)

# These are not
_('Welcome %s, get started with ERPNext in just a few clicks.' % full_name)

_('Welcome %(name)s, get started with ERPNext in just a few clicks.' % {'name': full_name})

# This one uses the positional formatter,
# but won't work because the string is formatted before it is passed to _()
_('Welcome {0}, get started with ERPNext in just a few clicks.'.format(full_name))
```

Example in JavaScript

```js
// This is fine
__('Welcome {0}, get started with ERPNext in just a few clicks.', [full_name])

// This is not
__(`Welcome ${full_name}, get started with ERPNext in just a few clicks.`)
```

### 3. Blocks

Don't split your string into separate blocks of strings and then concatenate
them. Don't write multiline strings. Always write your string in a single even
if the string is very large.

Example in Python

```py
# This is fine
_('You have {0} subscribers in your mailing list.').format(len(subscribers))

# Don't split strings
_('You have ') + len(subscribers) + _(' subscribers in your mailing list.')

# Don't write multiline strings
_('You have {0} subscribers \
	in your mailing list').format(len(subscribers))
```

Example in JavaScript

```js
// This is fine
__('You have {0} subscribers in your mailing list.', [subscribers.length])

// Don't split strings
__('You have ') + subscribers.length + __(' subscribers in your mailing list.')

// Don't write multiline strings
__('You have {0} subscribers' +
	'in your mailing list', [subscribers.length])
```

### 4. Plural

Don't try to pluralize words using logic. Every language has different plural
forms.

```py
# Don't do this
msg = _("You have {0} pending invoice").format(invoice_count)
if invoice_count > 1:
  msg += _("s")

# Write separate strings
# Every language has different plural forms
if invoice_count > 1:
  msg = _("You have {0} pending invoices").format(invoice_count)
else:
  msg = _("You have {0} pending invoice").format(invoice_count)
```

### 4. No Trailing Spaces

Don't start or end the sentence with spaces. Trailing spaces gets trimmed for other languages when passed through translation engine.

If you have to add space around your text, you can do it outside the translation syntax.

```py
# Don't do this
msg = _(" You have {0} pending invoice ")

# Do this
msg = ' ' + _("You have {0} pending invoices") + ' '
```

### 5. Adding context for a string

> Introduced in version 13

A translatable string can have different meaning in different context.
For example, string "Change" can mean "to make or become different" or "Coins".
So to tackle this issue `context` variable can be used to set the context for
a string so that it can be translated differently in different
language using [Translation Tool](https://docs.erpnext.com/docs/user/manual/en/translations).

In JavaScript

```js

_("Change", null, "Coins")

// Here "Coins" sets the context for text "Change"
```

In Python

```py

_("Change", context="Switch")

# Here "Switch" sets the context for text "Change"
```

## Adding a New Language

To add a new language, follow these steps:

#### Step 1: Export to a file

```sh
$ bench --site sitename get-untranslated [lang] [path-to-file]
```

#### Step 2: Translate

Create another file with updated translations (in the same order as the source
file). For this you can use the [Google Translator
Toolkit](https://translate.google.com/toolkit) or [Bing
Translator](http://www.bing.com/translator/).

#### Step 3: Import your translations

```sh
$ bench update-translations [lang] [source-path] [translated-path]
```

A new file will be created with the name `[lang].csv` in the `translations`
folder in each app.

#### Step 4: Update `languages.json`

Add your language in `frappe/geo/languages.json`

#### Step 5: Commit each app and push

Commit your changes with the `.csv` files in each app and push them to their
repositories.
