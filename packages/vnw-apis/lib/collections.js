//Namespace Collections
Collections = {};
Collections.Users = new Mongo.Collection("vnw_users");
Collections.CompanySettings = new Mongo.Collection("vnw_company_settings");

Collections.Jobs = new Mongo.Collection("vnw_jobs");

Collections.Applications = new Mongo.Collection("vnw_applications");

Collections.Applications.allow({
    update: function(userId, doc) {
        return !!userId;
    }
});

Collections.Candidates = new Mongo.Collection("vnw_candidates");
Collections.Activities = new Mongo.Collection("vnw_activities");

/**
 * Collection MailTemplates
 */
Collections.MailTemplates = new Mongo.Collection("vnw_mail_templates");
Collections.MailTemplates.allow({
    insert: function (userId, doc) {
        if (userId)
            return true;
        return false;
    },
    update: function(userId, doc, fieldNames, modifier) {
        if (doc.createdBy == userId) {
            return true;
        }
        return false;
    },
    remove: function (userId, doc) {
        if (doc.type == 2) {
            if (doc.createdBy == userId) {
                return true;
            }
        }
        return false;
    }
})
if (Meteor.isServer) {
    Collections.MailTemplates.before.insert(function (userId, doc) {
        if(!userId) return;
        doc.createdAt = new Date();
        doc.modifiedAt = new Date();
        doc.createdBy = parseInt(userId);
        doc.modifiedBy = parseInt(userId);
    });
}