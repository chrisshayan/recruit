//===================================================================================================================//
// JOB APPLICATION PROFILE
//===================================================================================================================//
JobApplicationProfile = BlazeComponent.extendComponent({
    onCreated: function () {
        var self = this;
        this.props = new ReactiveDict;
        this.props.setDefault('isLoading', false);

        this.defaultToggle = 'More cover letter <i class="fa fa-angle-down"></i>';
        this.coverLetterToggle = new ReactiveVar(this.defaultToggle);

        // Track when current application change
        Template.instance().autorun(function () {
            var params = Router.current().params;
            var jobId = parseInt(params.jobId);
            var stage = _.findWhere(Recruit.APPLICATION_STAGES, {alias: params.stage});
            var applicationId = parseInt(params.query.application);
            self.props.set('applicationId', applicationId);

            var application = Collections.Applications.findOne({entryId: applicationId});
            self.props.set('application', application);

            if(application) {
                var candidate = Collections.Candidates.findOne({candidateId: application.candidateId});
                self.props.set('candidate', candidate);
            }
        });

        // Bind empty event
        Event.on('emptyProfile', function () {
            self.props.set('application', null);
            self.props.set('candidate', null);
        });
    },

    onRendered: function () {
        // Add slimScroll to element
        $('.full-height-scroll').slimscroll({
            height: '100%'
        });


    },
    onDestroyed: function () {
    },

    events: function () {
        return [{
            'click .more-coverletter': this.toggleCoverLetter
        }];
    },

    /**
     * EVENTS
     */
    toggleCoverLetter: function (e, tmpl) {
        var target = $('.cover-letter p');
        if (target.hasClass("more")) {
            target.removeClass("more");
            this.coverLetterToggle.set('More cover letter <i class="fa fa-angle-down"></i>');
        } else {
            target.addClass("more");
            this.coverLetterToggle.set('Less cover letter <i class="fa fa-angle-up"></i>');
        }
    },


    /**
     * HELPERS
     */

    /**
     * get candidate fullname
     * @returns {string}
     */
    fullname: function () {
        var can = this.props.get('candidate');
        if (!can) return "";
        return can.data.lastname + " " + can.data.firstname;
    },

    /**
     * get candidate job title
     * @returns {String}
     */
    jobTitle: function () {
        var can = this.props.get('candidate');
        if (!can) return "";
        return can.data.jobtitle;
    },

    /**
     * Cover letter
     */
    coverLetter: function () {
        var app = this.props.get('application');
        if (!app)
            return "";
        var nl2br = function (str, is_xhtml) {
            var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; // Adjust comment to avoid issue on phpjs.org display

            return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
        };
        return nl2br(app.data.coverletter);
    },

    /**
     * get candidate city location
     * @returns {String}
     */
    city: function () {
        var can = this.props.get('candidate');
        if (!can) return "";
        return can.data.city;
    },
    /**
     * Get candidate phone: cellphone or homephone
     * @returns {String}
     */
    phone: function () {
        var can = this.props.get('candidate');
        if (!can) return "";
        return can.data.cellphone || can.data.homephone || "";
    },

    profileUrl: function () {
        var url = Meteor.settings.public.applicationUrl;
        return sprintf(url, this.props.get('applicationId'));
    },

    isDisqualified: function() {
        return this.props.get('application').disqualified;
    }

}).register('JobApplicationProfile');