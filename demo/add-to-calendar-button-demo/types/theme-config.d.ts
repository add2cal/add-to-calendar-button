import type { ThemeObjectOrShikiThemeName } from 'rehype-expressive-code';
import type { CollectionKey } from 'astro:content';

/**
 * Top-level configuration object for the Stardrive theme.
 *
 * Configure site identity, internationalization (i18n), structured-data
 * author/publisher info, and article/blog behavior here.
 *
 * @see ../theme.config.ts for the live configuration used by the site.
 */
export interface ThemeConfig {
  /**
   * Canonical base URL of the site, including protocol and no trailing slash.
   *
   * Used to generate absolute URLs (sitemap, RSS, OG tags, structured data).
   *
   * @example "https://peltmonger.com"
   */
  site: string;

  /**
   * Primary brand color as hex code.
   *
   * NOTE: Keep this in sync with `src/styles/tailwind.config.css`.
   *
   * @example "#0d9488"
   */
  primaryColor?: string;

  /**
   * Theme color for browsers that support it (e.g. mobile address bar).
   *
   * If not set, falls back to {@link primaryColor}.
   */
  themeColor?: string;

  /**
   * If `true`, generates a webmanifest at `/site.webmanifest` with basic metadata and icon references.
   *
   * Icons need to be placed manually in the `public` directory.
   */
  generateWebmanifest?: boolean;

  /**
   * Human-readable name and short name of the site, used in meta tags and the webmanifest.
   *
   * If not set, the domain name from {@link site} is used as a fallback.
   */
  name?: string;
  shortName?: string;

  /**
   * Site name used for Open Graph meta tags (`og:site_name`).
   *
   * If not set, falls back to meta.og-site-name from the default language's translation module
   */
  ogTitle?: string;

  /**
   * If `true`, enables dark mode support with automatic OS-level preference detection and mode switcher.
   *
   * Requires additional CSS.
   */
  darkMode?: boolean;

  /**
   * Default robots meta tag value for all pages, used when no page-specific value is set.
   *
   * Can be overridden per-page via frontmatter or layout props.
   *
   * If not set, defaults to "noindex, nofollow".
   *
   * @example "index, follow"
   */
  robots?: string;

  /**
   * Default X (Twitter) handle used in social meta tags (without the `@`).
   *
   * Can be overridden per-section (e.g. `articles.social.xHandle`).
   *
   * @example "jekuer"
   */
  xHandle?: string;

  /**
   * Default author used in structured data (schema.org).
   * Also used for meta tags when an article does not define its own
   * author and there also is no default set at {@link articles}.
   */
  author: {
    /** Schema.org entity type for the author. */
    type: 'Person' | 'Organization';
    /** Display name of the author. */
    name: string;
    /** URL representing the author (e.g. homepage or profile). */
    url?: string;
    /** Absolute or site-relative URL to an author image / logo. */
    image?: string;
  };

  /**
   * Publisher information used in structured data (schema.org).
   *
   * Often identical to {@link author} for personal sites, but can differ
   * for organizations or multi-author publications.
   */
  publisher: {
    /** Schema.org entity type for the publisher. */
    type: 'Person' | 'Organization';
    /** Display name of the publisher. */
    name: string;
    /** URL representing the publisher. */
    url?: string;
    /** Absolute or site-relative URL to the publisher logo. */
    image?: string;
  };

  /**
   * Internationalization (i18n) configuration.
   *
   * Controls available languages, the default locale, translation strings,
   * and locale-specific structured data overrides.
   */
  i18n: {
    /**
     * Locale used when no language prefix is present in the URL.
     *
     * Must also be listed in {@link locales}.
     *
     * @example "en"
     */
    defaultLocale: string;

    /**
     * All locales the site supports, including the default one.
     *
     * Used to generate localized routes and `hreflang` tags.
     *
     * @example ["en", "de", "fr"]
     */
    locales: string[];

    /**
     * Human-readable language names keyed by locale code.
     * Recommendation: use the native language name.
     *
     * Shown in the language switcher UI.
     *
     * @example { en: "English", de: "Deutsch", fr: "Français" }
     */
    languages: {
      [key: string]: string;
    };

    /**
     * Translation string modules keyed by locale code.
     *
     * Typically imported from `src/i18n/<locale>.json` at the top of the
     * theme.config.ts file. Values may be flat strings or nested objects
     * for grouped translations.
     */
    languageModules: {
      [key: string]: {
        [key: string]: string | { [key: string]: string | { [key: string]: string } };
      };
    };

    /**
     * Per-locale overrides for structured data (author / publisher).
     *
     * Useful when a name or URL differs between languages (e.g. localized
     * domains). The default locale does not need an entry.
     */
    translatedStructuredData?: {
      [key: string]: {
        /** Localized author overrides. */
        author?: {
          /** Localized author display name. */
          name?: string;
          /** Localized author URL. */
          url?: string;
        };
        /** Localized publisher overrides. */
        publisher?: {
          /** Localized publisher display name. */
          name?: string;
          /** Localized publisher URL. */
          url?: string;
        };
      };
    };
  };

  /**
   * Optional list of Expressive Code themes to enable for code blocks.
   *
   * Provide theme names supported by Expressive Code / Shiki.
   * Available options: https://expressive-code.com/guides/themes/#available-themes
   *
   * @example 'github-dark', 'github-light'
   */
  expressiveCodeThemes?: {
    light: ThemeObjectOrShikiThemeName;
    dark?: ThemeObjectOrShikiThemeName;
  };

  /**
   * Settings that control the articles / blog section of the site.
   */
  articles?: {
    /** If `true`, use a fallback image when an article has no cover image. */
    imageFallback?: boolean;

    /** in Grid View, posts get displayed in a grid layout instead of a list. The first one will be always prominent on top. */
    gridView?: boolean;

    /** If `true`, display text over the article image instead of below it. Only applies for the grid view and larger screen sizes. */
    textOverImage?: boolean;

    /** If `true`, enable category pages and category metadata. If set to `false`, make sure to also remove category directories under /pages */
    categories?: boolean;

    /** If `true`, enable tag pages and tag metadata. If set to `false`, make sure to also remove tag directories under /pages */
    tags?: boolean;

    /** Number of articles shown per paginated listing page. */
    entriesPerPage: number;

    /**
     * Maximum heading depth (min 2) included in the table of contents. Can be overridden per-article via frontmatter. Set to 0 to disable the table of contents.
     *
     * @example 3 // includes h2 and h3
     */
    tocMaxDepth: number;

    /** Default values applied to articles when not specified in frontmatter. */
    defaults?: {
      /** Default article author. */
      author?: {
        /** Author display name. */
        name: string;
        /** Author URL (e.g. profile or homepage). */
        url?: string;
      };
    };

    /**
     * Social-sharing configuration for article pages.
     *
     * Can be overridden at the `Single` component level.
     */
    social: {
      /**
       * X (Twitter) handle used for article share cards (without the `@`).
       *
       * Falls back to {@link ThemeConfig.xHandle} if omitted.
       */
      xHandle?: string;

      /** Social share buttons shown on regular (desktop) viewports. */
      buttons: SocialButtons;

      /**
       * Optional alternate set of share buttons for small (mobile) viewports.
       *
       * If omitted, {@link buttons} is used on all viewports.
       */
      buttonsSmallScreen?: SocialButtons;
    };
  };

  /**
   * Enable/Disable promotional content globally.
   */
  promotions?: {
    /** Newsletter signup at the bottom of the page (above the footer) or in the footer. Set `false`, `bottom`, or `footer` */
    newsletterSignup?: string | boolean;
    /** Big banner area above the newsletter signup above the footer. Can be overridden per page */
    footerBanner?: boolean;
    /** Ad banner in any main nav dropdown */
    navAd?: boolean;
    /** Small banner at the very top of the page. Can be overridden per page */
    topBanner?: boolean;
    /** Small banner in the hero section */
    heroChip?: boolean;
  };

  /**
   * Mark content collections that have individual pages per item to be rendered dynamically on the server instead of being prerendered.
   * This is useful for large collections that would otherwise bloat the build output and increase build times.
   *
   * On-demand collections also have `deferRender` enabled on their glob loader, so entries are not
   * rendered eagerly during sync — rendering happens on demand when a page needs it. This lowers memory usage
   * during sync for large collections at the cost of not caching rendered HTML across builds.
   *
   * Example: ['articles', 'integration_options', 'events'] - this would render all articles, integration options, and events (all possible collections in the demo) on-demand instead of prerendering them.
   */
  onDemandRenderedCollections?: CollectionKey[];

  /**
   * Settings that control the events section of the site.
   */
  events?: {
    /**
     * Load events from Add to Calendar PRO via API instead of the local content collection.
     * This allows for real-time updates of events without touching the code or rebuilding the site, but requires an active Add to Calendar PRO subscription and API key (Read scope).
     * The API key needs to be set in the environment variable `ADD_TO_CALENDAR_PRO_API_KEY` and the `dynamicEvents` property needs to be set to `true`.
     *
     * Mind that this will exclude the events from the sitemap since the sitemap only updates on rebuild; but this is usually neglectable.
     *
     * IMPORTANT: Recurring events are currently not supported, even if Add to Calendar PRO supports them. If you have recurring events, please create separate events for each occurrence instead.
     * This would be also a TODO to optimize later.
     */
    dynamicEvents?: {
      pullFromAddToCalendarPro?: boolean;
      /** If you want to only show some events, filter */
      filterBy?: {
        /** from a specific date on, set the UTC ISO datetime (or "now" to use the current date and time) here */
        from?: string;
        /** until a specific date, set the UTC ISO datetime (or "now" to use the current date and time) here */
        to?: string;
        /** from a specific group, add the group's Prokey here */
        group?: string;
      };
    };
  };

  /**
   * Optional configuration for llms.txt file generation.
   */
  llms?: {
    /**
     * When enabled (default: false), the build process will generate an llms.txt file at the site root,
     * including content based on the `addArticles`, `addEvents`, and `addFAQ` settings.
     */
    autoGeneration?: boolean;

    /** Introductory text included at the top of the generated llms.txt file. */
    intro?: string;

    /**
     * Glob patterns for pages to exclude from llms.txt generation when `autoGeneration` is enabled.
     *
     * Patterns are matched against page URLs (e.g. "/blog/my-article"), not file paths.
     * Content collections are not included by default in order to not blow up the llms.txt with potentially hundreds of articles, events, or FAQ entries.
     * You can include specific articles, events, or FAQ entries via the `addArticles`, `addEvents`, and `addFAQ` settings, and further fine-tune inclusion/exclusion with the `includePages` setting.
     * Same applies for pages with robots set to "noindex" - they are excluded by default, but can be included via `includePages` if needed.
     *
     * @example ["/integration/**", "/integration/"] // excludes all pages under /integration, including the main /integration page
     */
    excludePagesPattern?: string[];

    /**
     * Specific page URLs to include in llms.txt when `autoGeneration` is enabled, even if they match an exclude pattern.
     *
     * Useful for including important pages that would otherwise be excluded by `excludePagesPattern`.
     *
     * @example ["/integration/special-tool"] // includes this page even if it matches an exclude pattern
     */
    includePages?: string[];

    /**
     * Determines which articles are included in llms.txt when `autoGeneration` is enabled.
     *
     * - `none`: No articles are included. Default.
     * - `all`: All articles are included, except those matching `excludePagesPattern`.
     * - `selected`: Only articles with frontmatter property `llmsTxt: true` are included.
     *
     * If a path is added to `includePages`, it will be included regardless of this setting, so you can still include specific articles even if you set this to `none`.
     */
    addArticles?: string;
    /**
     * Determines which FAQ entries are included in llms.txt when `autoGeneration` is enabled.
     *
     * - `none`: No FAQ entries are included. Default.
     * - `all`: All FAQ entries are included, except those matching `excludePagesPattern`.
     * - `selected`: Only FAQ entries with frontmatter property `llmsTxt: true` are included.
     *
     * If a path is added to `includePages`, it will be included regardless of this setting, so you can still include specific FAQ entries even if you set this to `none`.
     */
    addFAQ?: string;
    /**
     * Determine which Events are included in llms.txt when `autoGeneration` is enabled.
     *
     * - `none`: No Events are included. Default.
     * - `all`: All Events are included, except those matching `excludePagesPattern`.
     * - `selected`: Only Events with frontmatter property `llmsTxt: true` are included.
     *
     * If a path is added to `includePages`, it will be included regardless of this setting, so you can still include specific Events even if you set this to `none`.
     */
    addEvents?: string;
  };

  /**
   * Optional question that gets submitted to AI agents when clicking on respective buttons in the UI.
   *
   * @example "I am evaluating the Astro Stardrive boilerplate (github.com/peltmonger/stardrive) for my website. Provide a detailed analysis of its features, strengths, and weaknesses. Can you help me using it? How do I get started?"
   */
  askAiTrigger?: string;

  /**
   * A custom list of features from the default boilerplate that has been removed in this projects (either via the starter tool or manually).
   * Use this to keep track on your bigger changes.
   * This also helps any AI agent to understand what is missing on purpose.
   *
   * @example ["events", "integrations", "blog"]
   */
  droppedFeatures?: string[];
}

/**
 * Toggles for individual social-share buttons.
 *
 * Set a property to `true` to enable the corresponding share button.
 * Omitted or `false` properties are hidden.
 */
export interface SocialButtons {
  /** Share via email (`mailto:` link). */
  email?: boolean;
  /** Share to Facebook. */
  facebook?: boolean;
  /** Share to Hacker News. */
  hackernews?: boolean;
  /** Share to LinkedIn. */
  linkedin?: boolean;
  /** Share to Pinterest. */
  pinterest?: boolean;
  /** Share to Reddit. */
  reddit?: boolean;
  /** Share to Telegram. */
  telegram?: boolean;
  /** Share to X (Twitter). */
  x?: boolean;
  /** Share to WhatsApp. */
  whatsapp?: boolean;
}
