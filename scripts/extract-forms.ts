import * as cheerio from 'cheerio'

interface FormField {
  name: string
  type: string
  label?: string
  placeholder?: string
  required: boolean
  options?: string[] // for select/radio/checkbox
}

interface Form {
  url: string
  formId?: string
  fields: FormField[]
  submitText: string
  action?: string
  method?: string
}

/**
 * Extract form data from page HTML
 */
export function extractForms(url: string, html: string): Form[] {
  const $ = cheerio.load(html)
  const forms: Form[] = []

  $('form').each((formIndex, formEl) => {
    const $form = $(formEl)
    const formId = $form.attr('id') || $form.attr('class') || `form-${formIndex}`
    const action = $form.attr('action')
    const method = $form.attr('method')?.toUpperCase() || 'GET'

    const fields: FormField[] = []

    // Extract input fields
    $form.find('input, textarea, select').each((_, fieldEl) => {
      const $field = $(fieldEl)
      const type = $field.attr('type') || $field.prop('tagName')?.toLowerCase() || 'text'
      const name = $field.attr('name') || $field.attr('id') || ''
      
      if (!name || type === 'submit' || type === 'button' || type === 'hidden') {
        return // skip
      }

      // Find label
      let label = ''
      const fieldId = $field.attr('id')
      if (fieldId) {
        const $label = $(`label[for="${fieldId}"]`)
        if ($label.length > 0) {
          label = $label.text().trim()
        }
      }
      if (!label) {
        // Try parent label
        const $parentLabel = $field.closest('label')
        if ($parentLabel.length > 0) {
          label = $parentLabel.text().trim()
        }
      }
      if (!label) {
        // Use placeholder or name as fallback
        label = $field.attr('placeholder') || name
      }

      const field: FormField = {
        name,
        type,
        label,
        placeholder: $field.attr('placeholder'),
        required: $field.attr('required') !== undefined || $field.hasClass('required'),
      }

      // Extract options for select/radio/checkbox
      if (type === 'select' || $field.is('select')) {
        field.options = []
        $field.find('option').each((_, opt) => {
          const optText = $(opt).text().trim()
          if (optText) field.options!.push(optText)
        })
      } else if (type === 'radio' || type === 'checkbox') {
        const value = $field.attr('value')
        if (value) {
          field.options = [value]
        }
      }

      fields.push(field)
    })

    // Extract submit button text
    let submitText = 'Submit'
    const $submit = $form.find('button[type="submit"], input[type="submit"]').first()
    if ($submit.length > 0) {
      submitText = $submit.attr('value') || $submit.text().trim() || 'Submit'
    }

    if (fields.length > 0) {
      forms.push({
        url,
        formId,
        fields,
        submitText,
        action,
        method,
      })
    }
  })

  return forms
}
