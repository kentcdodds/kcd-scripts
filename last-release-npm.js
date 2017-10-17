/*
 * Fork of https://github.com/semantic-release/last-release-npm in order to have
 * proper certificate support. Uses npm binary instead of npm-registry-client.
 *
 **/

const SemanticReleaseError = require('@semantic-release/error');
const npmlog = require('npmlog');
const execa = require('execa');

module.exports = async function({ retry } = {}, { pkg, npm, options }, cb) {
	npmlog.level = npm.loglevel || 'warn';

	try {
		const res = await execa('npm', [
			'info',
			'--json',
			`${pkg.name}@*`,
			'dist-tags',
			'version',
			'gitHead'
		]);
		const allData = JSON.parse(res.stdout) || [];
		const versions = allData.reduce(
			(agg, info) => Object.assign(agg, { [info.version]: info }),
			{}
		);
		const data = allData[0] || {};

		if (data && !data['dist-tags']) {
			return cb(null, {});
		}
		const distTags = data['dist-tags'];
		let version = distTags[npm.tag];

		if (
			!version &&
			options &&
			options.fallbackTags &&
			options.fallbackTags[npm.tag] &&
			distTags[options.fallbackTags[npm.tag]]
		) {
			version = distTags[options.fallbackTags[npm.tag]];
		}

		if (!version) {
			return cb(
				new SemanticReleaseError(
					`There is no release with the dist-tag "${npm.tag}" yet. Tag a version manually or define "fallbackTags".`,
					'ENODISTTAG'
				)
			);
		}

		cb(null, {
			version,
			gitHead: versions[version].gitHead,
			get tag() {
				npmlog.warn('deprecated', 'tag will be removed with the next major release');
				return npm.tag;
			}
		});
	} catch (err) {
		if (err.statusCode === 404 || /not found/i.test(err.message)) {
			return cb(null, {});
		}
		return cb(err);
	}
};
