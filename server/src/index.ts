import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import { 
  createDogToyInputSchema, 
  updateDogToyInputSchema, 
  createLandingPageContentInputSchema,
  updateLandingPageContentInputSchema
} from './schema';

// Import handlers
import { createDogToy } from './handlers/create_dog_toy';
import { getDogToys, getFeaturedDogToys } from './handlers/get_dog_toys';
import { updateDogToy } from './handlers/update_dog_toy';
import { deleteDogToy } from './handlers/delete_dog_toy';
import { createLandingPageContent } from './handlers/create_landing_page_content';
import { getLandingPageContent, getHeroContent, getCtaContent } from './handlers/get_landing_page_content';
import { updateLandingPageContent } from './handlers/update_landing_page_content';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check endpoint
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Dog toy endpoints
  createDogToy: publicProcedure
    .input(createDogToyInputSchema)
    .mutation(({ input }) => createDogToy(input)),

  getDogToys: publicProcedure
    .query(() => getDogToys()),

  getFeaturedDogToys: publicProcedure
    .query(() => getFeaturedDogToys()),

  updateDogToy: publicProcedure
    .input(updateDogToyInputSchema)
    .mutation(({ input }) => updateDogToy(input)),

  deleteDogToy: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteDogToy(input.id)),

  // Landing page content endpoints
  createLandingPageContent: publicProcedure
    .input(createLandingPageContentInputSchema)
    .mutation(({ input }) => createLandingPageContent(input)),

  getLandingPageContent: publicProcedure
    .query(() => getLandingPageContent()),

  getHeroContent: publicProcedure
    .query(() => getHeroContent()),

  getCtaContent: publicProcedure
    .query(() => getCtaContent()),

  updateLandingPageContent: publicProcedure
    .input(updateLandingPageContentInputSchema)
    .mutation(({ input }) => updateLandingPageContent(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();