(function() {
	"use strict";

	var USERNAME = "exabrial";

	function setText(id, value) {
		var el = document.getElementById(id);
		if (el) {
			el.textContent = value;
		}
	}

	function load() {
		var userUrl = "https://api.github.com/users/" + USERNAME;
		var repoUrl = "https://api.github.com/users/" + USERNAME + "/repos?per_page=100";

		Promise.all([
			fetch(userUrl).then(function(response) {
				return response.ok ? response.json() : Promise.reject(response.status);
			}),
			fetch(repoUrl).then(function(response) {
				return response.ok ? response.json() : Promise.reject(response.status);
			})
		]).then(function(results) {
			var user = results[0];
			var repos = Array.isArray(results[1]) ? results[1] : [];

			var reposByName = {};
			var totalStars = 0;
			repos.forEach(function(repo) {
				var stars = repo.stargazers_count || 0;
				reposByName[repo.name] = stars;
				totalStars += stars;
			});

			setText("stat-repos", String(user.public_repos || repos.length));
			setText("stat-stars", String(totalStars));
			setText("stars-petrify", "\u2605" + (reposByName["petrify"] || 0));
			setText("stars-locksmith", "\u2605" + (reposByName["locksmith"] || 0));
			setText("stars-mockito-object-injection", "\u2605" + (reposByName["mockito-object-injection"] || 0));
			setText("stars-redex-sm", "\u2605" + (reposByName["redex-sm"] || 0));
		}).catch(function() {
			/* keep static fallback values already in the HTML */
		});
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", load);
	} else {
		load();
	}
})();
