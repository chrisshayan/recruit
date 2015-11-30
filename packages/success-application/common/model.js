/**
 * Created by HungNguyen on 8/21/15.
 */


function formatDatetimeFromVNW(datetime) {
    var d = moment(datetime);
    var offsetBase = 420;
    var offsetServer = new Date().getTimezoneOffset();
    var subtract = offsetBase + offsetServer;
    d.subtract(subtract, 'minute');
    return d.toDate();
}

var mongoCollection = new Mongo.Collection(MODULE_NAME);

var model = Astro.Class({
    name: MODULE_NAME,
    collection: mongoCollection,
    fields: {
        appId: {
            type: 'number',
            optional: true
        },
        type: {
            type: 'number',
            default: () => 0
        },
        jobId: {
            type: 'number',
            optional: true
        },
        candidateId: {
            type: 'number',
            optional: true
        },
        companyId: {
            type: 'number'
        },
        stage: {
            type: 'number',
            default: ()=> 1
        }, // 0 : source, 1: applied, Default. 2: test assign, 3: Interview, 4: Offer letter, 5: Rejected
        matchingScore: {
            type: 'number',
            decimal: true,
            default: ()=> 0
        },
        disqualified: {
            type: 'array',
            default: ()=> []
        },
        coverLetter: {
            type: 'string',
            optional: true
        },
        firstname: {
            type: 'string',
            optional: true
        },
        genderId: {
            type: 'number',
            optional: true
        },
        lastname: {
            type: 'string',
            optional: true
        },
        fullname: {
            type: 'string',
            optional: true
        },
        dob: {
            type: 'date',
            optional: true
        },
        isDeleted: {
            type: 'boolean',
            optional: false
        },
        countryId: {
            type: 'number',
            optional: true
        },
        cityName: {
            type: 'string',
            default: ''
        },
        jobTitle: {
            type: 'string',
            default: ''
        },
        emails: {
            type: 'array'
        },
        appliedDate: {
            type: 'date',
            default: ()=> new Date()
        },
        updatedAt: {
            type: 'date',
            default: ()=> new Date()
        }

    }, // schema
    methods: {
        candidate: function () {

        },
        isExist(condition) {
            var query = condition || {entryID: this.entryId};
            return !!Collection.findOne(query);
        },
        matchingScoreLabel() {
            var matchingScore = this.matchingScore || 0;
            if (matchingScore >= 90)
                return " label-success ";
            else if (matchingScore >= 70)
                return " label-primary ";
            else if (matchingScore >= 50)
                return " label-warning ";
            else if (matchingScore > 0)
                return " label-default ";
            else
                return " hidden ";
        },
        isSentDirectly (){
            return this.source.type === 2;
        },

        shortCoverLetter() {
            if (!this.coverLetter) return "";
            return this.coverLetter.split(/\s+/).splice(0, 14).join(" ") + "...";
        }
    } // prototype
});


Application = model;
Collection = model.getCollection();


if (Meteor.isServer) {
    Collection.before.insert((userId, doc)=> {
        doc.fullname = [doc.firstname, doc.lastname].join(' ').trim();
    });

    Collection.after.insert(function (userId, doc) {
        let createdBy = userId || 'vnw'
            , ref = {
            appId: doc.appId,
            candidateId: doc.candidateId,
            jobId: doc.jobId
        };

        var activity = new Activities({
            type: Activities.TYPE['APPLICATION_CREATE'],
            ref: ref,
            content: null,
            createdBy: createdBy,
            createdAt: formatDatetimeFromVNW(doc.appliedDate)
        });
        activity.save();

    })

}
