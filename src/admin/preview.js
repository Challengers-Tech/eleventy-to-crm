// Register the site's stylesheet for the preview pane
CMS.registerPreviewStyle('/css/style.css');

// Custom preview template for landing pages that matches layouts/landing.njk
// Note: createClass and h are global variables exposed by Decap CMS
var LandingPagePreview = createClass({
  render: function() {
    var entry = this.props.entry;

    // Get field values using getIn for nested Immutable data
    var title = entry.getIn(['data', 'title']) || '';
    var description = entry.getIn(['data', 'description']) || '';
    var headline = entry.getIn(['data', 'headline']) || '';
    var subheadline = entry.getIn(['data', 'subheadline']) || '';
    var heroImage = entry.getIn(['data', 'heroImage']) || '';
    var features = entry.getIn(['data', 'features']) || [];
    var cta = entry.getIn(['data', 'cta']) || {};
    var formFields = entry.getIn(['data', 'formFields']) || [];
    var body = this.props.widgetFor('body');

    // Convert Immutable objects to JS
    var ctaObj = cta.toJS ? cta.toJS() : {};
    var featuresArray = features.toJS ? features.toJS() : [];
    var formFieldsArray = formFields.toJS ? formFields.toJS() : [];

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
});

// Register the preview template for the 'pages' collection
CMS.registerPreviewTemplate('pages', LandingPagePreview);
