import React, { lazy, Suspense } from "react";
import { Route, Routes as RouterRoutes } from "react-router-dom";

import { CommonLayout } from "./layouts/CommonLayout";
const Top = lazy(() => import("./pages/Top").then(({ Top }) => ({ default: Top })));
const Odds = lazy(() => import("./pages/races/Odds").then(({ Odds }) => ({ default: Odds })));
const RaceCard = lazy(() => import("./pages/races/RaceCard").then(({ RaceCard }) => ({ default: RaceCard })));
const RaceResult = lazy(() => import("./pages/races/RaceResult").then(({ RaceResult }) => ({ default: RaceResult })));


/** @type {React.VFC} */
export const Routes = () => {
  return (
    <Suspense fallback={<div></div>}>
      <RouterRoutes>
        <Route element={<CommonLayout />} path="/">
          <Route index element={<Top />} />
          <Route element={<Top />} path=":date" />
          <Route path="races/:raceId">
            <Route element={<RaceCard />} path="race-card" />
            <Route element={<Odds />} path="odds" />
            <Route element={<RaceResult />} path="result" />
          </Route>
        </Route>
      </RouterRoutes>
    </Suspense>
  );
};
