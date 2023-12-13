<script setup lang="ts">
import View_DE from "@/components/translated/privacy-policy-de.vue";

const { locale } = useI18n();

definePageMeta({
  title: 'navigation.privacy-policy',
  description: 'meta.title_slug',
});

useHead({
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ],
});
</script>

<template>
  <h1 class="mb-12 underline decoration-primary-light decoration-4 dark:decoration-primary-dark">{{ $t('navigation.privacy-policy') }}</h1>
  <div class="max-w-4xl">
    <div class="mb-16 flex rounded-md bg-gradient-to-tr from-primary via-primary to-primary-light p-4 text-white shadow-md dark:from-primary dark:via-primary-dark dark:to-primary-dark">
      <svg class="h-10 w-10 flex-none fill-current text-inherit" enable-background="new 0 0 122.88 122.25" viewBox="0 0 122.88 122.25" xmlns="http://www.w3.org/2000/svg">
        <path
          d="m101.77 49.38c2.09 3.1 4.37 5.11 6.86 5.78 2.45 0.66 5.32 0.06 8.7-2.01 1.36-0.84 3.14-0.41 3.97 0.95 0.28 0.46 0.42 0.96 0.43 1.47 0.13 1.4 0.21 2.82 0.24 4.26 0.03 1.46 0.02 2.91-0.05 4.35 0 0.13-0.01 0.26-0.03 0.38-0.91 16.72-8.47 31.51-20 41.93-11.55 10.44-27.06 16.49-43.82 15.69v0.01c-0.13 0-0.26-0.01-0.38-0.03-16.72-0.91-31.51-8.47-41.93-20-10.45-11.55-16.49-27.06-15.69-43.82 0-0.13 0.01-0.26 0.03-0.38 0.9-16.74 8.71-31.61 20.47-42.09 11.77-10.5 27.52-16.6 44.28-15.8 1.6 0 2.89 1.29 2.89 2.89 0 0.4-0.08 0.78-0.23 1.12-1.17 3.81-1.25 7.34-0.27 10.14 0.89 2.54 2.7 4.51 5.41 5.52 1.44 0.54 2.2 2.1 1.74 3.55h0.01c-1.83 5.89-1.87 11.08-0.52 15.26 0.82 2.53 2.14 4.69 3.88 6.4 1.74 1.72 3.9 3 6.39 3.78 4.04 1.26 8.94 1.18 14.31-0.55 1.27-0.4 2.62 0.12 3.31 1.2zm-42.49 8.48c2.77 0 5.01 2.24 5.01 5.01s-2.24 5.01-5.01 5.01-5.01-2.24-5.01-5.01 2.25-5.01 5.01-5.01zm-21.72 20.63c3.37 0 6.11 2.73 6.11 6.11s-2.73 6.11-6.11 6.11-6.11-2.73-6.11-6.11 2.73-6.11 6.11-6.11zm13.16-46.74c2.65 0 4.79 2.14 4.79 4.79s-2.14 4.79-4.79 4.79-4.79-2.14-4.79-4.79 2.15-4.79 4.79-4.79zm68.58 0.65c1.98 0 3.58 1.6 3.58 3.58s-1.6 3.58-3.58 3.58-3.58-1.6-3.58-3.58c-0.01-1.97 1.6-3.58 3.58-3.58zm-25.68-9.49c2.98 0 5.39 2.41 5.39 5.39s-2.41 5.39-5.39 5.39-5.39-2.41-5.39-5.39c0-2.97 2.41-5.39 5.39-5.39zm4.17-22.32c3.19 0 5.78 2.59 5.78 5.78s-2.59 5.78-5.78 5.78-5.78-2.59-5.78-5.78c0.01-3.2 2.59-5.78 5.78-5.78zm-21.06 80.04c4.43 0 8.03 3.59 8.03 8.03 0 4.43-3.59 8.03-8.03 8.03s-8.03-3.59-8.03-8.03 3.59-8.03 8.03-8.03zm-44.82-33.85c4.8 0 8.69 3.89 8.69 8.69s-3.89 8.69-8.69 8.69-8.69-3.89-8.69-8.69c0-4.79 3.89-8.69 8.69-8.69zm75.22 13.96c-3.39-0.91-6.35-3.14-8.95-6.48-5.78 1.52-11.16 1.41-15.76-0.02-3.37-1.05-6.32-2.81-8.71-5.18s-4.21-5.32-5.32-8.75c-1.51-4.66-1.69-10.2-0.18-16.32-3.1-1.8-5.25-4.53-6.42-7.88-1.06-3.05-1.28-6.59-0.61-10.35-13.91 0.19-26.88 5.6-36.77 14.42-10.67 9.51-17.75 22.97-18.57 38.11v0.05l-0.01 0.13c-0.76 15.25 4.72 29.35 14.19 39.83 9.44 10.44 22.84 17.29 38 18.1h0.05l0.13 0.01c15.24 0.77 29.35-4.71 39.83-14.19 10.44-9.44 17.29-22.84 18.1-38v-0.05l0.01-0.13c0.07-1.34 0.09-2.64 0.06-3.91-3.22 1.21-6.24 1.38-9.07 0.61zm9.02 3.3zm-57.94 52.38z"
        />
      </svg>
      <div class="mx-4 p-2 text-left">
        <p class="pb-4 text-xl font-bold leading-6">{{ $t('content.privacy.no-cookies') }}!</p>
        <p>
          {{ $t('content.privacy.no-cookies-details-1') }}<br />
          {{ $t('content.privacy.no-cookies-details-2') }}<br />
          {{ $t('content.privacy.no-cookies-details-3') }}
        </p>
      </div>
    </div>
    <View_DE v-if="locale=='de'" />
    <div v-else>
      <h2>1. An overview of data protection</h2>
      <h3>General information</h3>
      <p>
        The following information will provide you with an easy to navigate overview of what will happen with your personal data when you visit this website. The term &ldquo;personal data&rdquo; comprises all data that can be used to personally identify you. For detailed information about the
        subject matter of data protection, please consult our Data Protection Declaration, which we have included beneath this copy.
      </p>
      <h3>Data recording on this website</h3>
      <h4>Who is the responsible party for the recording of data on this website (i.e., the &ldquo;controller&rdquo;)?</h4>
      <p>The data on this website is processed by the operator of the website, whose contact information is available under section &ldquo;Information about the responsible party (referred to as the &ldquo;controller&rdquo; in the GDPR)&rdquo; in this Privacy Policy.</p>
      <h4>How do we record your data?</h4>
      <p>We collect your data as a result of your sharing of your data with us. This may, for instance be information you send us via email.</p>
      <p>
        Other data shall be recorded by our IT systems automatically or after you consent to its recording during your website visit. This data comprises primarily technical information (e.g., web browser, operating system, or time the site was accessed). This information is recorded automatically
        when you access this website.
      </p>
      <h4>What are the purposes we use your data for?</h4>
      <p>A portion of the information is generated to guarantee the error free provision of the website. Other data may be used to analyze data - e.g. if the server crashes.</p>
      <h4>What rights do you have as far as your information is concerned?</h4>
      <p>
        You have the right to receive information about the source, recipients, and purposes of your archived personal data at any time without having to pay a fee for such disclosures. You also have the right to demand that your data are rectified or eradicated. If you have consented to data
        processing, you have the option to revoke this consent at any time, which shall affect all future data processing. Moreover, you have the right to demand that the processing of your data be restricted under certain circumstances. Furthermore, you have the right to log a complaint with the
        competent supervising agency.
      </p>
      <p>Please do not hesitate to contact us at any time if you have questions about this or any other data protection related issues.</p>
      <h2>2. Hosting</h2>
      <p>
        This website is hosted externally. Personal data collected on this website are stored on the servers of the host. These may include, but are not limited to, IP addresses, contact requests, metadata and communications, contract information, contact information, names, web page access, and
        other data generated through a web site.
      </p>
      <p>
        The external hosting serves the purpose of fulfilling the contract with our potential and existing customers (Art. 6(1)(b) GDPR) and in the interest of secure, fast, and efficient provision of our online services by a professional provider (Art. 6(1)(f) GDPR). If appropriate consent has been
        obtained, the processing is carried out exclusively on the basis of Art. 6 (1)(a) GDPR and &sect; 25 (1) TTDSG, insofar the consent includes the storage of cookies or the access to information in the user's end device (e.g., device fingerprinting) within the meaning of the TTDSG. This
        consent can be revoked at any time.
      </p>
      <p>Our host(s) will only process your data to the extent necessary to fulfil its performance obligations and to follow our instructions with respect to such data.</p>
      <p>We are using the following host(s):</p>
      <p>
        Microsoft Corporation<br />
        One Microsoft Way<br />
        Redmond, WA 98052-6399, USA<br />
        <br />
        GitHub Inc.<br />
        88 Colin P Kelly Junior Street<br />
        San Francisco, CA 94107, USA<br />
        <br />
        Google Ireland Limited<br />
        Gordon House, Barrow Street<br />
        Dublin 4, Irland<br />
        <br />
        Cloudflare, Inc.<br />
        101 Townsend St.<br />
        San Francisco, CA 94107
      </p>
      <h3>Data processing</h3>
      <p>We have concluded a data processing agreement (DPA) for the use of the above-mentioned service. This is a contract mandated by data privacy laws that guarantees that they process personal data of our website visitors only based on our instructions and in compliance with the GDPR.</p>
      <h2>3. General information and mandatory information</h2>
      <h3>Data protection</h3>
      <p>The operators of this website and its pages take the protection of your personal data very seriously. Hence, we handle your personal data as confidential information and in compliance with the statutory data protection regulations and this Data Protection Declaration.</p>
      <p>
        Whenever you use this website, a variety of personal information will be collected. Personal data comprises data that can be used to personally identify you. This Data Protection Declaration explains which data we collect as well as the purposes we use this data for. It also explains how,
        and for which purpose the information is collected.
      </p>
      <p>We herewith advise you that the transmission of data via the Internet (i.e., through email communications) may be prone to security gaps. It is not possible to completely protect data against third-party access.</p>
      <h3>Information about the responsible party (referred to as the &ldquo;controller&rdquo; in the GDPR)</h3>
      <p>The data processing controller on this website is:</p>
      <p>
        Jens K&uuml;rschner<br />
        Tal 44<br />
        80331 M&uuml;nchen<br />
        GERMANY
      </p>

      <p>
        Email: <span style="display:none; ">are-</span><span style="display:inline; ">&#x73;&#x75;&#x70;&#x70;&#x6F;&#x72;&#x74;</span><span style="display:none; ">-xya34</span><span style="display:inline; ">[at]</span><span style="display:none; ">ddks-</span
        ><span style="display:inline; ">&#97;&#100;&#100;&#45;&#116;&#111;&#45;&#99;&#97;&#108;&#101;&#110;&#100;&#97;&#114;&#45;&#112;&#114;&#111;&#46;&#99;&#111;&#109;</span>
      </p>
      <p>The controller is the natural person or legal entity that single-handedly or jointly with others makes decisions as to the purposes of and resources for the processing of personal data (e.g., names, email addresses, etc.).</p>

      <h3>Storage duration</h3>
      <p>
        Unless a more specific storage period has been specified in this privacy policy, your personal data will remain with us until the purpose for which it was collected no longer applies. If you assert a justified request for deletion or revoke your consent to data processing, your data will be
        deleted, unless we have other legally permissible reasons for storing your personal data (e.g., tax or commercial law retention periods); in the latter case, the deletion will take place after these reasons cease to apply.
      </p>
      <h3>General information on the legal basis for the data processing on this website</h3>
      <p>
        If you have consented to data processing, we process your personal data on the basis of Art. 6(1)(a) GDPR or Art. 9 (2)(a) GDPR, if special categories of data are processed according to Art. 9 (1) DSGVO. In the case of explicit consent to the transfer of personal data to third countries, the
        data processing is also based on Art. 49 (1)(a) GDPR. If you have consented to the storage of cookies or to the access to information in your end device (e.g., via device fingerprinting), the data processing is additionally based on &sect; 25 (1) TTDSG. The consent can be revoked at any
        time. If your data is required for the fulfillment of a contract or for the implementation of pre-contractual measures, we process your data on the basis of Art. 6(1)(b) GDPR. Furthermore, if your data is required for the fulfillment of a legal obligation, we process it on the basis of Art.
        6(1)(c) GDPR. Furthermore, the data processing may be carried out on the basis of our legitimate interest according to Art. 6(1)(f) GDPR. Information on the relevant legal basis in each individual case is provided in the following paragraphs of this privacy policy.
      </p>
      <h3>Revocation of your consent to the processing of data</h3>
      <p>A wide range of data processing transactions are possible only subject to your express consent. You can also revoke at any time any consent you have already given us. This shall be without prejudice to the lawfulness of any data collection that occurred prior to your revocation.</p>
      <h3>Right to object to the collection of data in special cases; right to object to direct advertising (Art. 21 GDPR)</h3>
      <p>
        IN THE EVENT THAT DATA ARE PROCESSED ON THE BASIS OF ART. 6(1)(E) OR (F) GDPR, YOU HAVE THE RIGHT TO AT ANY TIME OBJECT TO THE PROCESSING OF YOUR PERSONAL DATA BASED ON GROUNDS ARISING FROM YOUR UNIQUE SITUATION. THIS ALSO APPLIES TO ANY PROFILING BASED ON THESE PROVISIONS. TO DETERMINE THE
        LEGAL BASIS, ON WHICH ANY PROCESSING OF DATA IS BASED, PLEASE CONSULT THIS DATA PROTECTION DECLARATION. IF YOU LOG AN OBJECTION, WE WILL NO LONGER PROCESS YOUR AFFECTED PERSONAL DATA, UNLESS WE ARE IN A POSITION TO PRESENT COMPELLING PROTECTION WORTHY GROUNDS FOR THE PROCESSING OF YOUR DATA,
        THAT OUTWEIGH YOUR INTERESTS, RIGHTS AND FREEDOMS OR IF THE PURPOSE OF THE PROCESSING IS THE CLAIMING, EXERCISING OR DEFENCE OF LEGAL ENTITLEMENTS (OBJECTION PURSUANT TO ART. 21(1) GDPR).
      </p>
      <p>
        IF YOUR PERSONAL DATA IS BEING PROCESSED IN ORDER TO ENGAGE IN DIRECT ADVERTISING, YOU HAVE THE RIGHT TO OBJECT TO THE PROCESSING OF YOUR AFFECTED PERSONAL DATA FOR THE PURPOSES OF SUCH ADVERTISING AT ANY TIME. THIS ALSO APPLIES TO PROFILING TO THE EXTENT THAT IT IS AFFILIATED WITH SUCH
        DIRECT ADVERTISING. IF YOU OBJECT, YOUR PERSONAL DATA WILL SUBSEQUENTLY NO LONGER BE USED FOR DIRECT ADVERTISING PURPOSES (OBJECTION PURSUANT TO ART. 21(2) GDPR).
      </p>
      <h3>Right to log a complaint with the competent supervisory agency</h3>
      <p>
        In the event of violations of the GDPR, data subjects are entitled to log a complaint with a supervisory agency, in particular in the member state where they usually maintain their domicile, place of work or at the place where the alleged violation occurred. The right to log a complaint is
        in effect regardless of any other administrative or court proceedings available as legal recourses.
      </p>
      <h3>Right to data portability</h3>
      <p>
        You have the right to demand that we hand over any data we automatically process on the basis of your consent or in order to fulfil a contract be handed over to you or a third party in a commonly used, machine readable format. If you should demand the direct transfer of the data to another
        controller, this will be done only if it is technically feasible.
      </p>
      <h3>Information about, rectification and eradication of data</h3>
      <p>
        Within the scope of the applicable statutory provisions, you have the right to at any time demand information about your archived personal data, their source and recipients as well as the purpose of the processing of your data. You may also have a right to have your data rectified or
        eradicated. If you have questions about this subject matter or any other questions about personal data, please do not hesitate to contact us at any time.
      </p>
      <h3>Right to demand processing restrictions</h3>
      <p>You have the right to demand the imposition of restrictions as far as the processing of your personal data is concerned. To do so, you may contact us at any time. The right to demand restriction of processing applies in the following cases:</p>
      <ul>
        <li>In the event that you should dispute the correctness of your data archived by us, we will usually need some time to verify this claim. During the time that this investigation is ongoing, you have the right to demand that we restrict the processing of your personal data.</li>
        <li>If the processing of your personal data was/is conducted in an unlawful manner, you have the option to demand the restriction of the processing of your data in lieu of demanding the eradication of this data.</li>
        <li>If we do not need your personal data any longer and you need it to exercise, defend or claim legal entitlements, you have the right to demand the restriction of the processing of your personal data instead of its eradication.</li>
        <li>If you have raised an objection pursuant to Art. 21(1) GDPR, your rights and our rights will have to be weighed against each other. As long as it has not been determined whose interests prevail, you have the right to demand a restriction of the processing of your personal data.</li>
      </ul>
      <p>
        If you have restricted the processing of your personal data, these data &ndash; with the exception of their archiving &ndash; may be processed only subject to your consent or to claim, exercise or defend legal entitlements or to protect the rights of other natural persons or legal entities
        or for important public interest reasons cited by the European Union or a member state of the EU.
      </p>
      <h3>SSL and/or TLS encryption</h3>
      <p>
        For security reasons and to protect the transmission of confidential content, such as purchase orders or inquiries you submit to us as the website operator, this website uses either an SSL or a TLS encryption program. You can recognize an encrypted connection by checking whether the address
        line of the browser switches from &ldquo;http://&rdquo; to &ldquo;https://&rdquo; and also by the appearance of the lock icon in the browser line.
      </p>
      <p>If the SSL or TLS encryption is activated, data you transmit to us cannot be read by third parties.</p>
      <h2>4. Recording of data on this website</h2>
      <h3>Server log files</h3>
      <p>The provider of this website and its pages automatically collects and stores information in so-called server log files, which your browser communicates to us automatically. The information comprises:</p>
      <ul>
        <li>The type and version of browser used</li>
        <li>The used operating system</li>
        <li>Referrer URL</li>
        <li>The hostname of the accessing computer</li>
        <li>The time of the server inquiry</li>
        <li>The IP address</li>
      </ul>
      <p>This data is not merged with other data sources.</p>
      <p>This data is recorded on the basis of Art. 6(1)(f) GDPR. The operator of the website has a legitimate interest in the technically error free depiction and the optimization of the operator&rsquo;s website. In order to achieve this, server log files must be recorded.</p>
    </div>
  </div>
</template>

<style scoped>
h2 {
  @apply pt-10 pb-4;
}

h3 {
  @apply pt-8 pb-3;
}

h4 {
  @apply pt-6 pb-2 font-semibold;
}

ul {
  @apply list-disc py-4 pl-6;
}
</style>
