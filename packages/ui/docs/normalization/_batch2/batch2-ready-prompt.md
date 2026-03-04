You are a Principal Design System Architect on branch `feat/ui`.

Read ALL of these before starting:
- `packages/ui/docs/normalization/per-app/*_baseline-summary.md`
- `../migrate-app_admin-portal/apps/admin-portal/docs/migration/component/02-design-system-foundation.md` (admin-portal)
- `../migrate-app_admin-portal/apps/admin-portal/docs/migration/component/06-component-standards.md` (admin-portal)
- `../migrate-app_admin-portal-boost/apps/admin-portal-boost/docs/migration/component/02-design-system-foundation.md` (admin-portal-boost)
- `../migrate-app_admin-portal-boost/apps/admin-portal-boost/docs/migration/component/06-component-standards.md` (admin-portal-boost)
- `../migrate-app_affiliate-admin/apps/affiliate-admin/docs/migration/component/02-design-system-foundation.md` (affiliate-admin)
- `../migrate-app_affiliate-admin/apps/affiliate-admin/docs/migration/component/06-component-standards.md` (affiliate-admin)
- `../migrate-app_affiliate-portal/apps/affiliate-portal/docs/migration/component/02-design-system-foundation.md` (affiliate-portal)
- `../migrate-app_affiliate-portal/apps/affiliate-portal/docs/migration/component/06-component-standards.md` (affiliate-portal)
- `../migrate-app_agent-admin/apps/agent-admin/docs/migration/component/02-design-system-foundation.md` (agent-admin)
- `../migrate-app_agent-admin/apps/agent-admin/docs/migration/component/06-component-standards.md` (agent-admin)
- `../migrate-app_agent-microsite/apps/agent-microsite/docs/migration/component/02-design-system-foundation.md` (agent-microsite)
- `../migrate-app_agent-microsite/apps/agent-microsite/docs/migration/component/06-component-standards.md` (agent-microsite)
- `../migrate-app_agent-portal/apps/agent-portal/docs/migration/component/02-design-system-foundation.md` (agent-portal)
- `../migrate-app_agent-portal/apps/agent-portal/docs/migration/component/06-component-standards.md` (agent-portal)
- `../migrate-app_agent-web-portal/apps/agent-web-portal/docs/migration/component/02-design-system-foundation.md` (agent-web-portal)
- `../migrate-app_agent-web-portal/apps/agent-web-portal/docs/migration/component/06-component-standards.md` (agent-web-portal)
- `../migrate-app_boost-product-fe/apps/boost-product-fe/docs/migration/component/02-design-system-foundation.md` (boost-product-fe)
- `../migrate-app_boost-product-fe/apps/boost-product-fe/docs/migration/component/06-component-standards.md` (boost-product-fe)
- `../migrate-app_claim-portal/apps/claim-portal/docs/migration/component/02-design-system-foundation.md` (claim-portal)
- `../migrate-app_claim-portal/apps/claim-portal/docs/migration/component/06-component-standards.md` (claim-portal)
- `../migrate-app_customer-portal/apps/customer-portal/docs/migration/component/02-design-system-foundation.md` (customer-portal)
- `../migrate-app_customer-portal/apps/customer-portal/docs/migration/component/06-component-standards.md` (customer-portal)
- `../migrate-app_ecommerce-gelm/apps/ecommerce-gelm/docs/migration/component/02-design-system-foundation.md` (ecommerce-gelm)
- `../migrate-app_ecommerce-gelm/apps/ecommerce-gelm/docs/migration/component/06-component-standards.md` (ecommerce-gelm)
- `../migrate-app_ecommerce-teman/apps/ecommerce-teman/docs/migration/component/02-design-system-foundation.md` (ecommerce-teman)
- `../migrate-app_ecommerce-teman/apps/ecommerce-teman/docs/migration/component/06-component-standards.md` (ecommerce-teman)
- `../migrate-app_gegm-friendcover/apps/gegm-friendcover/docs/migration/component/02-design-system-foundation.md` (gegm-friendcover)
- `../migrate-app_gegm-friendcover/apps/gegm-friendcover/docs/migration/component/06-component-standards.md` (gegm-friendcover)
- `../migrate-app_gegm-friendcover-admin/apps/gegm-friendcover-admin/docs/migration/component/02-design-system-foundation.md` (gegm-friendcover-admin)
- `../migrate-app_gegm-friendcover-admin/apps/gegm-friendcover-admin/docs/migration/component/06-component-standards.md` (gegm-friendcover-admin)
- `../migrate-app_gelm-xproject-microsite/apps/gelm-xproject-microsite/docs/migration/component/02-design-system-foundation.md` (gelm-xproject-microsite)
- `../migrate-app_gelm-xproject-microsite/apps/gelm-xproject-microsite/docs/migration/component/06-component-standards.md` (gelm-xproject-microsite)
- `../migrate-app_gen-ai-portal/apps/gen-ai-portal/docs/migration/component/02-design-system-foundation.md` (gen-ai-portal)
- `../migrate-app_gen-ai-portal/apps/gen-ai-portal/docs/migration/component/06-component-standards.md` (gen-ai-portal)
- `../migrate-app_getrev-da-microsite/apps/getrev-da-microsite/docs/migration/component/02-design-system-foundation.md` (getrev-da-microsite)
- `../migrate-app_getrev-da-microsite/apps/getrev-da-microsite/docs/migration/component/06-component-standards.md` (getrev-da-microsite)
- `../migrate-app_grab-landing-page/apps/grab-landing-page/docs/migration/component/02-design-system-foundation.md` (grab-landing-page)
- `../migrate-app_grab-landing-page/apps/grab-landing-page/docs/migration/component/06-component-standards.md` (grab-landing-page)
- `../migrate-app_haruuz-microsite/apps/haruuz-microsite/docs/migration/component/02-design-system-foundation.md` (haruuz-microsite)
- `../migrate-app_haruuz-microsite/apps/haruuz-microsite/docs/migration/component/06-component-standards.md` (haruuz-microsite)
- `../migrate-app_mykawan-website/apps/mykawan-website/docs/migration/component/02-design-system-foundation.md` (mykawan-website)
- `../migrate-app_mykawan-website/apps/mykawan-website/docs/migration/component/06-component-standards.md` (mykawan-website)
- `../migrate-app_partner-portal/apps/partner-portal/docs/migration/component/02-design-system-foundation.md` (partner-portal)
- `../migrate-app_partner-portal/apps/partner-portal/docs/migration/component/06-component-standards.md` (partner-portal)
- `../migrate-app_sso-portal/apps/sso-portal/docs/migration/component/02-design-system-foundation.md` (sso-portal)
- `../migrate-app_sso-portal/apps/sso-portal/docs/migration/component/06-component-standards.md` (sso-portal)
- `../migrate-app_teman-affiliate-admin/apps/teman-affiliate-admin/docs/migration/component/02-design-system-foundation.md` (teman-affiliate-admin)
- `../migrate-app_teman-affiliate-admin/apps/teman-affiliate-admin/docs/migration/component/06-component-standards.md` (teman-affiliate-admin)
- `../migrate-app_teman-affiliate-microsite/apps/teman-affiliate-microsite/docs/migration/component/02-design-system-foundation.md` (teman-affiliate-microsite)
- `../migrate-app_teman-affiliate-microsite/apps/teman-affiliate-microsite/docs/migration/component/06-component-standards.md` (teman-affiliate-microsite)
- `../migrate-app_teman-affiliate-portal/apps/teman-affiliate-portal/docs/migration/component/02-design-system-foundation.md` (teman-affiliate-portal)
- `../migrate-app_teman-affiliate-portal/apps/teman-affiliate-portal/docs/migration/component/06-component-standards.md` (teman-affiliate-portal)
- `../migrate-app_ticket-portal/apps/ticket-portal/docs/migration/component/02-design-system-foundation.md` (ticket-portal)
- `../migrate-app_ticket-portal/apps/ticket-portal/docs/migration/component/06-component-standards.md` (ticket-portal)
- `packages/ui/src/**`
- `packages/config/**`
- `packages/helper/**`
- `packages/interface/**`

If any required file is missing, STOP and report it.

Batch 2 outputs must be created in:
- `packages/ui/docs/normalization/_output/`
