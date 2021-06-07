const SessionHandler = require("./session");
const ProfileHandler = require("./profile");
const BenefitsHandler = require("./benefits");
const ContributionsHandler = require("./contributions");
const AllocationsHandler = require("./allocations");
const MemosHandler = require("./memos");
const ResearchHandler = require("./research");
const {
    environmentalScripts
} = require("../../config/config");
const ErrorHandler = require("./error").errorHandler;

const index = (app, db) => {

    "use strict";

    const sessionHandler = new SessionHandler(db);
    const profileHandler = new ProfileHandler(db);
    const benefitsHandler = new BenefitsHandler(db);
    const contributionsHandler = new ContributionsHandler(db);
    const allocationsHandler = new AllocationsHandler(db);
    const memosHandler = new MemosHandler(db);
    const researchHandler = new ResearchHandler(db);

    const isLoggedIn = sessionHandler.isLoggedInMiddleware;

    const isAdmin = sessionHandler.isAdminUserMiddleware;

    app.get("/", sessionHandler.displayWelcomePage);

    app.get("/login", sessionHandler.displayLoginPage);
    app.post("/login", sessionHandler.handleLoginRequest);

    app.get("/signup", sessionHandler.displaySignupPage);
    app.post("/signup", sessionHandler.handleSignup);

    app.get("/logout", sessionHandler.displayLogoutPage);

    app.get("/dashboard", isLoggedIn, sessionHandler.displayWelcomePage);

    app.get("/profile", isLoggedIn, profileHandler.displayProfile);
    app.post("/profile", isLoggedIn, profileHandler.handleProfileUpdate);

    app.get("/contributions", isLoggedIn, contributionsHandler.displayContributions);
    app.post("/contributions", isLoggedIn, contributionsHandler.handleContributionsUpdate);

    app.get("/benefits", isLoggedIn, benefitsHandler.displayBenefits);
    app.post("/benefits", isLoggedIn, benefitsHandler.updateBenefits);

    app.get("/allocations/:userId", isLoggedIn, allocationsHandler.displayAllocations);

    app.get("/memos", isLoggedIn, memosHandler.displayMemos);
    app.post("/memos", isLoggedIn, memosHandler.addMemos);

    app.get("/learn", isLoggedIn, (req, res) => {
        return res.redirect(req.query.url);
    });

    app.get("/tutorial", (req, res) => {
        return res.render("tutorial/a1", {
            environmentalScripts
        });
    });

    app.get("/tutorial/:page", (req, res) => {
        const {
            page
        } = req.params
        return res.render(`tutorial/${page}`, {
            environmentalScripts
        });
    });

    app.get("/research", isLoggedIn, researchHandler.displayResearch);

    app.use(ErrorHandler);
};

module.exports = index;
