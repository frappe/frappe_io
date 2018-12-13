// Copyright (c) 2018, Frappe Technologies Pvt. Ltd. and Contributors
// MIT License. See license.txt

frappe.ready(function() {

	const team_members_section = $(".team-section").append(`
		<section class="section-padding text-center section-bg">
			<div class='container'>
			<h3 class='mb-5'>Meet the Team</h3>
			<div class='row team-members'>
				<!--team-members -->
			</div>
			</div>
		</section>`
	).find('.team-members');

	frappe.call({
		'method': 'frappe_io.frappe_team.doctype.team_member.team_member.get_team_data'
	}).then((res) => {
		const team_members = res.message;
		team_members.forEach(member => {
			const social = (() => {
				let obj = {
					'label': '',
					'link': ''
				}
				if (member.github) {
					obj.label = '@' + member.github;
					obj.link = 'https://github.com/' + member.github;
				} else if (member.linkedin) {
					obj.label = 'LinkedIn Profile';
					obj.link = member.linkedin;
				} else if (member.twitter) {
					obj.label = '@' + member.twitter;
					obj.link = member.twitter;
				}
				return obj;
			})();

			const team_member = `
				<div class="col-sm-3 mb-4 person">
					<img class="greyscale img-fluid" src="
						${member.image || 'https://api.adorable.io/avatars/200/' + member.full_name}
					">
					<h5 class="mt-3 font-weight-normal">${member.full_name}</h5>
					<p class='text-muted'>${member.role}
						<br>
						<a  class='text-muted' href="https://github.com/${social.link}" target="_blank">
							${social.label}
						</a>
					</p>
				</div>`;

			team_members_section.append(team_member);
		});
	});














});
