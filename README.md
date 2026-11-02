# Riverlane Homes (demo real estate website)

A plain HTML, CSS and JavaScript website with no build step. The agency, agents and listings are fictional samples.

## Run it on your computer

Open this folder in VS Code and run:

```bash
npx serve .
```

## Add the chat widget and redeploy

1. Open RAG Studio at https://rag-studio-live-demonstration.vercel.app, then go to **Chatbots → Property Assistant → Channels → Web Widget**.
2. Under **Allowed domains**, add this website's address without `https://`. Then click **Save and generate widget code**, and copy the code.
3. In VS Code, open `index.html` and paste the code on the line below the `PASTE YOUR RAG STUDIO WIDGET SNIPPET` comment, just before `</body>`. Save the file.
4. Push the change:

   ```bash
   git add index.html
   git commit -m "Add chat widget"
   git push
   ```

5. Vercel redeploys the site when it receives the push. When the build finishes, refresh the website and look for the chat bubble in the bottom corner.

If the bubble doesn't appear, open the browser console. The widget logs the reason there, such as the domain not being allowed.

## Change a listing

Listings are in `listings.js`. The Property Assistant has its own copy in the RAG Studio repo at `sample-documents/property-assistant/`, so update both, or the chatbot will keep giving the old details.

## Photos

Photos are from [Unsplash](https://unsplash.com/license) and are saved in `images/`. They illustrate the sample listings and don't show real homes for sale.
