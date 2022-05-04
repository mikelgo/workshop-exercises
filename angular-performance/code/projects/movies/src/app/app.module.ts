import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppShellModule } from './app-shell/app-shell.module';
import { ROUTING_IMPORTS } from './app.routing';
import { TMDB_HTTP_INTERCEPTORS_PROVIDER } from './shared/auth/tmdb-http-interceptor.providers';

// Exercise 2: Include app intializer import here.

// Exercise 2: Include state intializer import here.

// Exercise 3: Include dirty checks import here.

import { SERVICE_WORKER_IMPORTS } from './shared/pwa/service-worker.imports';
import { RXA_PROVIDER } from './shared/rxa-custom/rxa.provider';
import { LetModule } from '@rx-angular/template/let';
import { RxActionFactory } from './shared/rxa-custom/actions';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    /**
     * **🚀 Perf Tip for UX:**
     *
     * Setup serviceworker to get caching for HTTP requests and assets as well as better offline experience.
     */
    SERVICE_WORKER_IMPORTS,
    AppShellModule,
    LetModule,
    ROUTING_IMPORTS,
    // Exercise 3: Include dirty checks module
    DirtyChecksModule,
  ],
  providers: [
    RxActionFactory,
    TMDB_HTTP_INTERCEPTORS_PROVIDER,

    // Exercise 2: Include app intializer import here.

    // Exercise 2: Include state intializer import here.

    /**
     * **🚀 Perf Tip for TBT, LCP, CLS:**
     *
     * Configure RxAngular to get maximum performance.
     */
    RXA_PROVIDER,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
