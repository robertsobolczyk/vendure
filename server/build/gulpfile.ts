import gulp from 'gulp';
import path from 'path';

gulp.task('copy-schemas', () => {
    return gulp.src(['../src/**/*.graphql']).pipe(gulp.dest('../dist/server/src'));
});

gulp.task('copy-email-templates', () => {
    return gulp.src(['../src/email/templates/**/*']).pipe(gulp.dest('../dist/cli/assets/email-templates'));
});

gulp.task('copy-cli-assets', () => {
    return gulp.src(['../cli/assets/**/*']).pipe(gulp.dest('../dist/cli/assets'));
});

gulp.task('copy-cli-images', () => {
    return gulp.src(['../mock-data/assets/**/*']).pipe(gulp.dest('../dist/cli/assets/images'));
});

gulp.task(
    'default',
    gulp.parallel(['copy-schemas', 'copy-email-templates', 'copy-cli-assets', 'copy-cli-images']),
);
