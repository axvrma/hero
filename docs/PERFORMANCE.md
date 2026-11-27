# Portfolio performance

Vite builds three static pages with a shared stylesheet and a small browser entry module. Supporting photographs are compressed WebP with intrinsic dimensions and responsive sources where available. The hero portrait loads eagerly. Employer, project and award imagery loads lazily. Interactive demos mount when visitors open their panels.

Run `npm run lighthouse` against a production-configured local build for a repeatable lab measurement. Configure the local origin with `AUDIT_URL` if needed. See the [implementation report](implementation-report.md) for verification of this rebuild.
