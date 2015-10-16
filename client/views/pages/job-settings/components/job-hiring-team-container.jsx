JobHiringTeamContainer = React.createClass({
    mixins: [ReactMeteorData],
    getInitialState() {
        return {
            inc: 10,
            limit: 10,
        };
    },
    getMeteorData() {
        var params = Router.current().params;
        var jobId = Utils.transformVNWId(params.jobId);
        var recruiters = {
            manager: [],
            recruiter: [],
            coordinator: [],
            sourcer: []
        };
        var sub = Meteor.subscribe('jobSettings', jobId);
        if(sub.ready()) {
            var job = Collections.Jobs.findOne({jobId: jobId});
            _.each(job.recruiters, function(recruiter) {
                _.each(recruiters, function(val, k) {
                    if(recruiter.roles.indexOf(k) >= 0) {
                        var user = Meteor.users.findOne({_id: recruiter.userId});
                        recruiters[k].push(user);
                    }
                });
            });
        }
        return {
            jobId: jobId,
            job: Collections.Jobs.findOne({jobId: jobId}),
            recruiters: recruiters
        };
    },

    childContextTypes: {
        state: React.PropTypes.object,
        actions: React.PropTypes.object
    },

    getChildContext() {
        return {
            state: {

            },
            actions: {
                assign: this.assign,
                unassign: this.unassign
            }
        };
    },

    assign(userId, role) {
        Meteor.call('assignJobRecruiter', this.data.jobId, role, userId, function() {

        });
    },

    unassign(userId, role) {
        Meteor.call('unassignJobRecruiter', this.data.jobId, role, userId, function() {

        });
    },

    getRecruiters() {
        var recruiters = {
            manager: [],
            recruiter: [],
            coordinator: [],
            sourcer: []
        };
        if(this.data.job && this.data.job.recruiters) {
            _.each(this.data.job.recruiters, function(recruiter) {
                _.each(recruiters, function(val, k) {
                    if(recruiter.roles.indexOf(k) >= 0) {
                        recruiters[k].push(recruiter.userId);
                    }
                });
            });
        }
        return recruiters;
    },

    render() {
        return <JobHiringTeam jobId={this.data.jobId} recruiters={this.data.recruiters} />
    }
})