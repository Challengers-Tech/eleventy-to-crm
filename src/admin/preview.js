// Register the site's stylesheet for the preview pane
CMS.registerPreviewStyle('/css/style.css');

// Get the h function and createClass from CMS
const { h, createClass } = CMS;

// Custom preview template for landing pages that matches layouts/landing.njk
CMS.registerPreviewTemplate('pages', createClass({
  render: function() {
    const entry = this.props.entry;
    const data = entry.get('data');

    // Get field values
    const title = data.get('title') || '';
    const description = data.get('description') || '';
    const headline = data.get('headline') || '';
    const subheadline = data.get('subheadline') || '';
    const heroImage = data.get('heroImage') || '';
    const features = data.get('features') || [];
    const cta = data.get('cta') || {};
    const formFields = data.get('formFields') || [];
    const body = this.props.widgetFor('body');

    // Convert Immutable objects to JS
    const ctaObj = cta.toJS ? cta.toJS() : {};
    const featuresArray = features.toJS ? features.toJS() : [];
    const formFieldsArray = formFields.toJS ? formFields.toJS() : [];

    return h('div', {},
      // Hero Section
      h('section', { className: 'hero' },
        h('div', { className: 'container' },
          h('h1', {}, headline),
          h('p', {}, subheadline),
          heroImage && h('img', { src: heroImage, alt: headline, className: 'hero-image' })
        )
      ),

      // Features Section
      featuresArray.length > 0 && h('section', { className: 'features' },
        h('div', { className: 'container' },
          h('h2', {}, 'Why Choose Us'),
          h('div', { className: 'features-grid' },
            featuresArray.map((feature, i) =>
              h('div', { key: i, className: 'feature-card' },
                feature.icon && h('div', { className: 'icon' }, feature.icon),
                h('h3', {}, feature.title),
                h('p', {}, feature.description)
              )
            )
          )
        )
      ),

      // Additional Content (markdown body)
      body && h('section', { className: 'content' },
        h('div', { className: 'container' }, body)
      ),

      // CTA and Form Section
      h('section', { className: 'cta-section' },
        h('div', { className: 'container' },
          h('h2', {}, ctaObj.buttonText || 'Get Started Today'),
          h('p', { className: 'subtitle' }, 'Fill out the form below and we\'ll get in touch with you shortly.'),

          h('form', { className: 'lead-form', onSubmit: (e) => e.preventDefault() },
            formFieldsArray.map((field, i) =>
              h('div', { key: i, className: 'form-group' },
                h('label', { htmlFor: field.name },
                  field.label,
                  field.required && ' *'
                ),
                field.type === 'textarea'
                  ? h('textarea', {
                      id: field.name,
                      name: field.name,
                      placeholder: field.placeholder || '',
                      required: field.required
                    })
                  : h('input', {
                      type: field.type,
                      id: field.name,
                      name: field.name,
                      placeholder: field.placeholder || '',
                      required: field.required
                    })
              )
            ),
            h('button', { type: 'submit', className: 'submit-btn' },
              ctaObj.buttonText || 'Get Started'
            )
          )
        )
      ),

      // Footer
      h('footer', { className: 'footer' },
        h('div', { className: 'container' },
          h('p', {}, '© 2024 Your Company. All rights reserved.')
        )
      )
    );
  }
}));
