function add_edit_links() {
    const path = $('body').data().path;

    frappe.call('frappe_io.www.new-docs.doc_utils.get_edit_link', { docs_path: path })
        .then(r => {
            const github_url = r.message || null;
            if (!github_url) return;

            $('.page-footer').append(`
                <div class="doc-edit-link border-top pt-4 mb-5">
                    ${__('Found a mistake or want to contribute?')}
                    <a href="${github_url}" target="_blank">${__('Edit this page on GitHub')}</a>
                </div>
            `)
        });
}

frappe.ready(add_edit_links);