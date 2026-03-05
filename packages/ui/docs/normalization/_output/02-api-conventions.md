# API Conventions (Batch 2 Refresh)

## Global Rules
- Canonical props: `variant`, `size`, `disabled`, `loading`, `error`, `className`
- Controlled state pairs: `open/onOpenChange`, `value/onValueChange`
- Canonical event names: `onClick`, `onChange`, `onValueChange`, `onOpenChange`, `onSubmit`
- Canonical slot names: `children`, `label`, `description`, `icon`, `leftIcon`, `rightIcon`, `actions`, `footer`

## Legacy to Canonical Mapping
| Legacy | Canonical |
| --- | --- |
| `isDisabled` | `disabled` |
| `isLoading`, `pending` | `loading` |
| `kind`, visual `type` | `variant` |
| `onChangeValue` | `onValueChange` |
| `isOpen` + close-only callbacks | `open` + `onOpenChange` |
| `additionalClassName` | `className` |

## Canonical Component Contracts
| Family | Canonical contract focus |
| --- | --- |
| Button | `variant`, `size`, `loading`, `disabled`, icon slots |
| Input | typed input modes, formatter hooks, `error`, `onValueChange` |
| Select | single/multi/searchable modes with one normalized API |
| Checkbox/RadioGroup/Switch | controlled checked/value model with strict accessibility |
| Dialog/Drawer | controlled open state, content slots, action/footer slots |
| Table/DataTable | structural slots, sorting/filter/pagination callback consistency |
| DatePicker family | single source API for date/date-range/date-time state changes |
| Alert/Notification family | severity variants and dismiss handling |
| Form | react-hook-form aligned wrappers with stable field conventions |

## Ref Forwarding Policy
- Required for Tier 1 primitives
- Required for Tier 2 when focus/measurement semantics are relevant

## Forbidden in @repo/ui API
- App domain props (`policy`, `claim`, app-specific models)
- App runtime props (`apiUrl`, service callbacks)
- Next.js-specific route/runtime coupling in component contracts