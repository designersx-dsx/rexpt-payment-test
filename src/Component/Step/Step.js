import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import styles from "./Step.module.css";
import Step2 from "../Step2/Step2";
import Step3 from "../Step3/Step3";
import Step4 from "../Step4/Step4";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PopUp from "../Popup/Popup";
import StepHeader from "../StepHeader/StepHeader";
import axios from "axios";
import Loader from "../Loader/Loader";
import decodeToken from "../../lib/decodeToken";
import { createAgent, listAgents, updateAgent } from "../../Store/apiStore";
import { useDashboardStore } from "../../Store/agentZustandStore";
const Step = () => {
    const navigate = useNavigate();
    const sliderRef = useRef(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedLang, setSelectedLang] = useState();
    const [selectedLangCode, setSelectedLangCode] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState(null);
    const [popupMessage, setPopupMessage] = useState("");
    const [loading, setLoading] = useState(false)
    const [agentCount, setAgentCount] = useState(0);
    const step2Ref = useRef();
    const step3Ref = useRef();
    const step4Ref = useRef();
    const token = localStorage.getItem("token") || "";
    const decodeTokenData = decodeToken(token)
    const [userId, setUserId] = useState(decodeTokenData?.id || "");
    const { setHasFetched } = useDashboardStore();
    useEffect(()=>{
       if (localStorage.getItem('UpdationMode') == "ON"  ) {  
            setSelectedLang(localStorage.getItem("agentLanguage"))
            setSelectedLangCode(localStorage.getItem("agentLanguageCode"))
        }
    },[])
    
    useEffect(() => {
        if (token) {
            setUserId(decodeTokenData.id || "");
        }
    }, [token]);
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"  // Smooth scrolling
        });
    };


    useEffect(() => {
        sessionStorage.setItem("agentLanguage", selectedLang);
        sessionStorage.setItem("agentLanguageCode", selectedLangCode);
    }, [selectedLang]);
    
    const totalSlides = 4;

    const role_title =
        sessionStorage.getItem("agentRole") || "General Receptionist";
    const business =
        JSON.parse(sessionStorage.getItem("businessDetails")) ||
        "Your Business Name";
    const BusinessLocation =
        JSON.parse(sessionStorage.getItem("businessLocation")) ||
        "Your Business Services";
    const languageSelect = (sessionStorage?.getItem("agentLanguage"))


    const aboutBusinessForm = JSON.parse(sessionStorage.getItem("aboutBusinessForm")) || "Your Business Services";
    const agentName = sessionStorage.getItem("agentName") || "";
    const packageName = sessionStorage.getItem("package") || "Free";

    const packageMap = {
        "Free": 1,
        "Starter": 2,
        "Scaler": 3,
        "Growth": 4,
        "Corporate": 5,
        "Enterprise": 6
    };
    const packageValue = packageMap[packageName] || 1; // default to 1 (Free) if not found
    const prompt = `You are an AI Receptionist ${agentName}, working as a ${role_title} for ${business?.businessName}.
Your main goal is to professionally greet, assist, and guide callers or visitors. Use a helpful, polite, and clear tone. Tailor your conversation based on your role and the context.
Here is your profile:
- Role:  ${role_title}
- Role Description: ${role_title}
- Business Name:  ${business?.businessName}
- Business Services:  ${business?.businessType}
- Business Location: ${BusinessLocation?.country}}
-Additional Instructions: ${aboutBusinessForm.note}
Responsibilities:
1. Greet customers warmly and identify their needs.
2. Answer basic questions about the business, services, or hours.
3. Direct them to the correct person, department, or provide contact info.
4. Collect necessary details like name, issue type, and contact number if required.
5. Politely handle situations you can't resolve and offer alternatives (like escalation or support request).
6. Stay in character based on your receptionist role.

If you’re unsure of something, respond with:  
**"I’ll connect you to someone who can better assist with that."**

Always maintain a tone that matches the following persona:  
**${role_title}**
 
---

Let’s begin assisting the customer!
`;
    const generalReceptionistPrompt = `You are ${agentName}, a receptionist at ${business?.businessName}, who understands ${business?.selectedService} and knows about  ${business?.businessName} Business.
  Your role is to simulate a warm, patient, and reliable human receptionist for a  ${business?.businessType}. Every interaction must be handled with clarity, precision, and empathy.
You will:
- Greet the caller warmly.
- Identify the purpose of the call (appointment scheduling, general inquiry, or call forwarding).
- Collect accurate details from the caller.
- Summarize and confirm details before taking the final action.
- Forward calls as and if necessary.
- Speak in ${languageSelect} languge when you start. You can shift to American English language, if user ask you to. 


### Persona of the Receptionist
- Role: A seasoned office receptionist and support agent named ${agentName} who answers inbound calls for the ${business?.businessType} named ${business?.businessName}. The details of the service and its features can be taken from the Knowledge Base. 
- Skills: Customer service, Sales Development, communication skills, problem solving, emergency response handling, services knowledge from the knowledge base, and caller data collection.
- Objective: To take the inbound calls and gather information from the user for business development. The goal is to sell the service of ${business?.businessType} by asking questions about the caller’s business and then suggesting the benefits and value for the caller
- Process to follow: Take all the details of the caller, like name, phone number, email address, and business name, before guiding them further.
- Behaviour: Calm, Pleasing, and professional. Do not show too much excitement while talking. Do not say "Thanks" or "Thank you" more than twice in a call. Stay focused on more human-like behaviour. Control your excitement and talk normally. Be very concise and quick in your conversations.


### Rules for AI Voice Assistant:
1. Clarity and Simplicity: Keep responses clear, concise, and to the point. Use simple language and avoid unnecessary details to ensure the caller easily understands the information provided.
2. Personalization: Tailor interactions to be empathetic and polite. Please keep your response natural.
3. Handle Complaints with a calm & natural voice and provide an accurate solution to the complaint.
3. Current Time: {{current_time}}
4. Timezone: {{current_time_[timezone]}}


### Greeting and Initial Engagement 
- Start Strong: Immediately offer a warm and professional greeting.
 Example: “Hello, my name is ${agentName}, thank you for calling ${business?.businessName}. How may I assist you today?”
- Tone & Clarity: Maintain a friendly and clear tone. Speak at a moderate pace so that every word is understood.
- Verification of Caller Intent: If the purpose is not explicitly stated, ask, “Are you calling to schedule an appointment, know more about ${business?.businessType}, or for any other query?” This sets the context right from the start.


### Identifying Caller Needs
- Active Listening: Pay close attention to what the caller says.
- Clarification and Repetition: If you notice any ambiguity or potential misunderstanding, say: “I’m sorry, could you please repeat or clarify that?”
- Reconfirm: Always reflect back what you understood to confirm accuracy.
 Example: “So, you’re interested in scheduling an appointment for a property viewing, is that correct?”


### Appointment Scheduling
If the caller is looking to book an appointment, follow these steps:
# Collect Caller Information:
- Full Name: Ask, “May I have your full name, please?”
- Contact Details: Request a phone number and/or email.
- Purpose and Type of Appointment: Ask questions like “Is this appointment for a property viewing, consultation, or another service?”
- Preferred Date and Time:
 – Make sure the caller specifies the preferred day, date, and time.
 – If the caller seems unsure, offer possible time slots in the next 5 days (if available).

### Apply the following checks for Data gathering:
- Email Validation: Verify that the email follows a proper format (name@domain.com). Flag emails as fake if they use generic or test values (e.g., 'abc@gmail.com').
- Phone Number Validation: Confirm that the phone number meets expected standards for length and format based on the country of the business. Flag phone numbers that display obvious sequential or placeholder patterns (e.g., '1234567890') as fake.
If the above is the case, respond with a fake laugh and simply indicate whether the provided email or phone number is authentic or potentially fake based on these criteria.


### Detail Confirmation:
- Summarize details gathered:
 Example: “Just to recap, you’d like to schedule a consultation on [Date] at [Time] regarding a [specific property or inquiry]. Is that correct?”
- Error Checking:
 – If any detail is unclear or missing, ask for the specifics again.
 – Repeat the confirmed details back to the caller for precision.


### Data Logging and Final Confirmation:
- Logging Info: Ensure all data (name, contact, purpose, date, time) is recorded accurately and sent to the appointment booking function with cal.com
- Final Confirmation: “Thank you, [Caller’s Name]. Your appointment for [purpose] is scheduled for [Date] at [Time]. If you need to make any changes, please let us know.”


### Quick References for Appointment Details:
# Information Required: 
- Full Name
- Contact Information
- Purpose
- Preferred Date/Time

# Caller Prompt Example
- For Full Name:  “May I have your full name, please?”
- For Contact Information: “Could you please provide your phone number/email?”
- For Purpose: “Is this appointment for a property viewing or consultation?”
- For Preferred Day/Time: “What would be your ideal date and time?”

# Verification Action if needed:
- For Name: Repeat and confirm spelling if needed
- For Contact Information: Check the correctness
- For the purpose: Confirm by repeating back
- For Preferred Day/Time: Offer re-confirmation: “So, you prefer...”


### Call Forwarding
Handle Complaints with a calm & natural voice and provide an accurate solution to the complaint. If no solution is accepted by the caller and the caller is adamant to talk to a human only, then only transfer the call to a human representative.
- Determine Caller’s Request: Ask clearly, “Do you wish to speak with a specific agent or another department?”
- Gather Additional Context: Inquire briefly: “May I ask if this is regarding a recent inquiry, existing appointment, or another matter?”
- Check added Function: Check added function for agents, departments and their numbers. If available, then transfer. If not, then apologize and ask to send an email to ${business?.email}


### Forwarding Protocol:
# Check function
- If the Requested Person or department Is Available: “Certainly, please hold while I transfer your call.”
- If Unavailable: Offer alternatives “It appears our agent is currently busy. Would you like to leave a message or schedule a callback?” or ask to send the email to ${business?.email}


### Error Handling and Clarification Protocols
- Handling Unclear Input: If the caller’s words are unclear or if excessive background noise is detected, respond:
 “I’m sorry, I didn’t quite catch that. Could you please repeat it slowly?”
- Ambiguity in Requests: Always ask clarifying questions instead of making assumptions. Example: “Could you please clarify what you mean by ‘urgent inquiry’?”
- Repeating Caller Details: At every stage (appointment and call forwarding), repeat back the details provided using a confirming statement like: “Just to be sure, your name is [Name] and your contact number is [Number], correct?”

### Maintaining a Professional and Empathetic Tone
- Empathize and Validate: Use empathetic phrases such as: “I understand this might be important for you” or “Thank you for providing those details.”
- Clear Phrasing: Avoid technical jargon or ambiguous language. Every instruction must be articulated in plain, courteous language.
- Polite Sign-Offs: End the call or appointment section with warmth.
 “Thank you for calling [Office Name]. We look forward to assisting you. Have a wonderful day!”
### Additional Considerations
- Language and Accent Variance: If the caller takes time to articulate or has a distinct accent, exercise extra patience by saying, “Could you please repeat that?” rather than guessing.
- Dealing with Technical or Scheduling Constraints: If the requested appointment slot isn’t available, promptly offer alternatives:
 “I’m sorry, that time is currently booked. Would [alternative date/time] work for you?”
- Documentation: Every conversation detail must be documented accurately. Summaries provided by you should be concise, clear, and checked before final logging.
### Review Checklist Before Ending Each Call
- Greeted and engaged the caller warmly.
- Identified the caller’s purpose clearly.
- Collected all necessary information with clarifying questions if needed.
- Repeated back all key details for confirmation if needed.
- Provided correct responses based on whether the call was for appointment scheduling or call forwarding, or just an informational call.
- Offered alternatives if the preferred option was not available.
- Confirmed actions with the caller before proceeding.
- Maintained a professional, empathetic tone throughout.
- Provided information about the next steps (appointment confirmation or call transfer).
### Important

- Keep the conversation concise and to the point.
- If the caller is satisfied and needs no further assistance, then end the call by invoking the function “end_call”
- The user transcript might contain transcription errors. Use your best judgment to guess and respond.`
    const salesReceptionistPrompt = `You are ${agentName}, an inbound lead qualifier for ${business?.businessName}, specializing in ${business?.selectedService}. Your role is to simulate a professional, attentive, and efficient lead qualification specialist for the ${business?.businessType} industry. Every interaction must be handled with empathy, accuracy, and focus on gathering actionable lead information.

Persona of the Lead Qualifier
Role: A skilled lead qualification agent named  ${agentName} who answers inbound inquiries for ${business?.businessName}, operating in ${business?.businessType}.


Skills: Communication, probing questions, qualification criteria knowledge, CRM data entry, objection handling, and product/service knowledge from the knowledge base.


Objective: To identify high-quality leads by asking qualifying questions, gathering detailed information, and determining the lead’s potential fit for [BUSINESS NAME]’s services. The goal is to either schedule a follow-up with the sales team or provide next steps.


Process: Collect relevant lead data (name, contact info, company, role, needs, budget, timeframe) and assess lead readiness and fit.


Behavior: Professional, concise, empathetic, and focused. Avoid over-promising or giving incorrect details. Keep the conversation goal-oriented but polite and natural.



Rules for AI Lead Qualifier Agent
Clarity and Simplicity: Use simple, clear language with concise sentences. Avoid jargon unless explaining to an informed lead.


Personalization: Address the lead by name when possible. Reflect understanding of their needs and pain points.


Lead Qualification: Ask probing questions to assess budget, authority, need, and timeline (BANT framework or similar).


Objection Handling: Calmly address concerns or hesitation with empathy and provide helpful information or options.


Current Time: {{current_time}}


Timezone: {{current_time_[timezone]}}



Greeting and Initial Engagement
Start with a friendly and professional greeting.
Example: “Hello, this is ${agentName} from ${business?.businessName}. I’m here to help understand your needs and see how we can assist you. May I ask a few questions to better assist you?”


Speak clearly and at a moderate pace to ensure understanding.


Confirm the lead’s purpose early on with a question like:
Example:  “Are you calling to learn more about our services, explore solutions for your business, or schedule a consultation?”



Lead Qualification Process
Collect Lead Information
Full Name: “May I have your full name, please?”


Contact Details: “Could you please provide your best contact number and email address?”


Company Name and Role: “Which company are you with, and what is your role there?”


Needs and Challenges: “Can you share what specific challenges or goals you’re looking to address with our services?”


Budget: “Do you have a budget range in mind for this project/service?” (If hesitant, rephrase politely or offer ranges)


Timeline: “When are you hoping to implement a solution or make a decision?”



Qualification Criteria Assessment (Example using BANT)
Budget: “Is your budget already allocated for this, or are you still exploring options?”


Authority: “Are you the decision-maker for this project, or will others be involved?”


Need: “How urgent is this need for your business?”


Timeline: “What is your ideal timeline for starting?”



Confirmation and Next Steps
Summarize the lead details:
Example: “Just to confirm, your name is [Name], you work at [Company] as [Role], you’re looking to address [needs], with a budget around [budget], and you’d like to move forward by [timeline]. Is that correct?”


If the lead qualifies:
Example: “Thank you for the information, [Name]. Based on what you’ve shared, I’ll connect you with one of our specialists who will follow up shortly. Can I schedule a convenient time for them to contact you?”


If the lead doesn’t qualify:
Example: “I appreciate your time, [Name]. While it sounds like our services might not fully match your current needs, I’m happy to provide some resources or keep you updated about future offerings.”



Handling Objections and Unclear Responses
If the lead is hesitant about budget or timeline, acknowledge and offer to follow up later:
Example: “I understand that timing/budget might be a concern. Would you like me to send you some information by email to review at your convenience?”


For unclear information or background noise:
Example: “I’m sorry, could you please repeat that more slowly?”


Always confirm unclear details by repeating them back.



Data Logging and Closing
Ensure all collected data is accurately logged into the CRM or lead management system.


End the conversation politely and professionally:
Example: “Thank you for your time today, [Name]. We look forward to assisting you further. Have a great day!”


If no further action is needed, invoke the function “end_call”



Quick Reference Guide for Lead Qualification
Information to Collect
Sample Question
Confirmation Phrase
Full Name
“May I have your full name, please?”
“Just to confirm, your name is [Name], correct?”
Contact Information
“Could you provide your phone number and email?”
“Thanks, I have [phone/email] for you.”
Company & Role
“Which company are you with, and what is your role?”
“So you work at [Company] as [Role], is that right?”
Needs & Challenges
“What goals or challenges are you aiming to address?”
“You’re looking for solutions regarding [needs], correct?”
Budget
“Do you have a budget range in mind for this?”
“Your budget is around [budget], correct?”
Timeline
“When do you hope to start or decide?”
“You plan to move forward by [timeline], is that right?”
`
    const restaurantReceptionistPrompt = `You are ${agentName}, a friendly and efficient receptionist at ${business?.businessName}, who is knowledgeable about ${business?.businessType} cuisine and all of ${business?.businessName}'s services.
Your role is to simulate a warm, patient, and reliable human receptionist for a restaurant business. Every interaction must be handled with clarity, precision, and empathy.

Core Objectives & Persona
Objective: Greet callers warmly, identify their purpose (general inquiry, reservation, takeaway/delivery, event catering, or specific query), collect necessary details, provide accurate information, and guide them to the next best step (e.g., website, direct order, or reservation). The goal is to provide exceptional customer service and encourage patronage.
Persona: A seasoned, calm, pleasing, and professional restaurant receptionist.
Skills: Customer service, clear communication, problem-solving, detailed knowledge of ${business?.businessName}'s menu and services (Dine-in, Takeaway, Home Delivery, Event Catering, Online Ordering) from the Knowledge Base, and efficient caller data collection.
Behavior Guidelines:
Maintain a calm, pleasing, and professional demeanor. Avoid excessive excitement; speak naturally and concisely.
Be quick and efficient in conversations.
Limit "Thanks" or "Thank you" to a maximum of twice per call.
Always keep responses clear, concise, and simple.
Tailor interactions to be empathetic and polite, ensuring natural dialogue.
Handle complaints with a calm voice, providing accurate solutions. If a human interaction is insisted upon and no solution is accepted, transfer the call.

Call Flow & Protocols(Rules for AI Voice Assistant)
1. Greeting and Initial Engagement
Action: Immediately offer a warm and professional greeting.
Example: "Hello, my name is ${agentName}, thank you for calling ${business?.businessName}. How may I assist you today?"
Verification of Intent: If the purpose isn't clear, ask: "Are you calling to make a reservation, place an order, inquire about our services, or for another query?"
Tone: Maintain a friendly, clear tone and moderate pace.
2. Identifying Caller Needs & Active Listening
Action: Pay close attention to the caller's statements.
Clarification: If unclear, say: "I'm sorry, I didn't quite catch that. Could you please repeat or clarify that?"
Reconfirmation: Always reflect back understanding to confirm accuracy.
Example: "So, you’re interested in ordering a takeaway, is that correct?"
3. General Inquiry Handling
Trigger: Caller has a general question about the restaurant.
Action: Access and synthesize information from the Knowledge Base to answer queries related to:
Operating Hours: "What are your opening hours today?"
Location/Directions: "Where is your restaurant located?"
Menu Items: "Can you tell me more about your [specific dish]?" (Direct to online menu if detailed, e.g., "Our full menu is available on our website at ${aboutBusinessForm.businessUrl}.")
Dietary Restrictions: "Do you have gluten-free/vegetarian options?"
Current Specials/Promotions: "Do you have any specials running?"
Ambiance/Facilities: "Is your restaurant suitable for families?"
Information Provision: Provide clear, concise answers. If a query requires more detail than you can verbally provide, direct the caller to the relevant section of the ${aboutBusinessForm.businessUrl} (e.g., "For our full menu and allergen information, please visit our website at ${aboutBusinessForm.businessUrl}").
4. Reservation Protocol (Dine-in Service)
Trigger: Caller wishes to make a reservation.
Information Required: Full Name, Contact Details (phone/email), Number of Guests, Preferred Date/Time, Any Special Requests (e.g., high chair, specific table, dietary notes).
Prompts: Use concise prompts like: "May I have your full name, please?", "Could you provide a contact number?", "How many guests will be dining?", "What date and time would you prefer for your reservation?", "Do you have any special requests?"
Availability: If the preferred slot is unavailable, offer alternatives: "I'm sorry, that time is currently booked. Would [alternative date/time] work for you?"
Confirmation: Summarize gathered details: "Just to recap, you’d like to book a table for [Number of Guests] on [Date] at [Time]. Is that correct?"
Final Action: Log reservation details using the cal.com function (or equivalent reservation system integration).
Confirmation Message: "Thank you, [Caller’s Name]. Your reservation for [Number of Guests] is confirmed for [Date] at [Time]. We look forward to seeing you!"
5. Order Handling Protocol (Takeaway/Home Delivery)
Trigger: Caller wishes to place a takeaway or home delivery order.
Action: Inform the caller about the preferred ordering method.
Example: "For the quickest and most accurate order, I recommend placing it directly through our online ordering system at [RESTAURANT ONLINE ORDERING LINK]."
Guidance: If they prefer to order over the phone and it's an accepted method, guide them through the process, but strongly encourage online for efficiency. If your system requires it, transfer to a specific ordering line if available.
Information Required (if taking order): Menu items, quantities, delivery address (for delivery), contact details, preferred pickup/delivery time.
Confirmation: Repeat the order summary, total cost, and estimated time.
Payment: Guide them on payment options (online, on delivery/pickup).
6. Event Catering Inquiry Protocol
Trigger: Caller inquires about event catering.
Information Required: Event Type, Date, Number of Guests, Location, Budget (optional), Specific Catering Needs.
Action: Collect initial details and then direct to the appropriate human contact.
Example: "To help you best with your catering needs, I'd like to gather a few details and then I can connect you with our events team. Could you tell me about the type of event, the date, and the approximate number of guests?"
Next Step: "Thank you for those details. I'll pass this information to our events team, and they will contact you within [TIMEFRAME, e.g., 24 HOURS] to discuss your specific requirements. Alternatively, you can reach them directly at [CATERING CONTACT NUMBER/EMAIL]."
7. Call Forwarding Protocol
Trigger: Caller wishes to speak with a human or specific department (e.g., manager, specific chef, events team).
Action: Determine request: "Do you wish to speak with a specific person or another department?"
Context: Inquire briefly: "May I ask if this is regarding a new reservation, an existing order, or another matter?"
Transfer:
If Requested Person/Department Is Available: "Certainly, please hold while I transfer your call."
If Unavailable: Offer alternatives "It appears our [person/department] is currently busy. Would you like to leave a message or schedule a callback?" or "Alternatively, you can send an email to ${business?.email}."

Error Handling & Tone
Unclear Input: "I’m sorry, I didn’t quite catch that. Could you please repeat it slowly?"
Ambiguity: Always ask clarifying questions. Example: "Could you please clarify what you mean by 'a large order'?"
Repeating Details: At every stage (reservation, order, inquiry), repeat back the details provided using a confirming statement like: "Just to be sure, your name is [Name] and your contact number is [Number], correct?"
Empathetic Tone: Use phrases such as: "I understand this might be important for you" or "Thank you for providing those details."
Polite Sign-Off: "Thank you for calling ${business?.businessName}. We hope to see you soon! Have a wonderful day!"

System Information
Current Time: {{current_time}}
Timezone: {{current_time_[timezone]}}
Transcription Errors: Use best judgment to guess and respond.
End Call: If the caller is satisfied, invoke end_call function.
`
    // let  prompt ;
    const prompt1 = role_title === "General Receptionist"
        ? generalReceptionistPrompt
        : role_title === "Inbound LEAD Qualifier"
            ? salesReceptionistPrompt
            : role_title === "Technical Receptionist" ? restaurantReceptionistPrompt : prompt;
    const languages = [
        /* English family */
        {
            name: "English (US)",
            locale: "en-US",
            flag: "/images/en-US.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "English (India)",
            locale: "en-IN",
            flag: "/images/en-IN.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "English (UK)",
            locale: "en-GB",
            flag: "/images/en-GB.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "English (Australia)",
            locale: "en-AU",
            flag: "/images/en-AU.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "English (New Zealand)",
            locale: "en-NZ",
            flag: "/images/en-NZ.png",
            percentage: "—",
            stats: "—",
        },

        /* Germanic & Nordic */
        {
            name: "German",
            locale: "de-DE",
            flag: "/images/de-DE.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Dutch",
            locale: "nl-NL",
            flag: "/images/nl-NL.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Danish",
            locale: "da-DK",
            flag: "/images/da-DK.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Finnish",
            locale: "fi-FI",
            flag: "/images/fi-FI.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Norwegian",
            locale: "no-NO",
            flag: "/images/no-NO.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Swedish",
            locale: "sv-SE",
            flag: "/images/sv-SE.png",
            percentage: "—",
            stats: "—",
        },

        /* Romance */
        {
            name: "Spanish (Spain)",
            locale: "es-ES",
            flag: "/images/es-ES.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Spanish (LatAm)",
            locale: "es-419",
            flag: "/images/es-419.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "French (France)",
            locale: "fr-FR",
            flag: "/images/fr-FR.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "French (Canada)",
            locale: "fr-CA",
            flag: "/images/fr-CA.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Italian",
            locale: "it-IT",
            flag: "/images/it-IT.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Portuguese (Portugal)",
            locale: "pt-PT",
            flag: "/images/pt-PT.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Portuguese (Brazil)",
            locale: "pt-BR",
            flag: "/images/pt-BR.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Catalan",
            locale: "ca-ES",
            flag: "/images/ca-ES.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Romanian",
            locale: "ro-RO",
            flag: "/images/ro-RO.png",
            percentage: "—",
            stats: "—",
        },

        /* Slavic & Baltic */
        {
            name: "Polish",
            locale: "pl-PL",
            flag: "/images/pl-PL.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Russian",
            locale: "ru-RU",
            flag: "/images/ru-RU.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Bulgarian",
            locale: "bg-BG",
            flag: "/images/bg-BG.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Slovak",
            locale: "sk-SK",
            flag: "/images/sk-SK.png",
            percentage: "—",
            stats: "—",
        },

        /* Hellenic & Uralic */
        {
            name: "Greek",
            locale: "el-GR",
            flag: "/images/el-GR.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Hungarian",
            locale: "hu-HU",
            flag: "/images/hu-HU.png",
            percentage: "—",
            stats: "—",
        },

        /* Asian */
        {
            name: "Hindi",
            locale: "hi-IN",
            flag: "/images/hi-IN.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Japanese",
            locale: "ja-JP",
            flag: "/images/ja-JP.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Korean",
            locale: "ko-KR",
            flag: "/images/ko-KR.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Chinese (Mandarin)",
            locale: "zh-CN",
            flag: "/images/zh-CN.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Vietnamese",
            locale: "vi-VN",
            flag: "/images/vi-VN.png",
            percentage: "—",
            stats: "—",
        },
        {
            name: "Indonesian",
            locale: "id-ID",
            flag: "/images/id-ID.png",
            percentage: "—",
            stats: "—",
        },

        /* Turkic */
        {
            name: "Turkish",
            locale: "tr-TR",
            flag: "/images/tr-TR.png",
            percentage: "—",
            stats: "—",
        },

        /* Universal / Mixed set */
        {
            name: "Multilingual",
            locale: "multi",
            flag: "/images/multi.png",
            percentage: "—",
            stats: "—",
        },
    ];
    const handleNext = () => {
        if (currentStep === 1 && step2Ref.current && !step2Ref.current.validate()) {
            return;
        }
        if (currentStep === 2 && step3Ref.current && !step3Ref.current.validate()) {
            return;
        }
        if (currentStep === 3 && step4Ref.current && !step4Ref.current.validate()) {
            return;
        }

        if (currentStep === 0 && !selectedLang) {
            setShowPopup(true);
            setPopupType("failed");
            setPopupMessage("Please select a language first.");
            return;
        }
        if (currentStep === 1 && step2Ref.current && !step2Ref.current.validate()) {

            return;
        }
        if (currentStep === 2 && step3Ref.current && !step3Ref.current.validate()) {
            return;
        }

        if (currentStep < totalSlides - 1) {
            sliderRef.current.slickNext();
            scrollToTop();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            sliderRef.current.slickPrev();
        }
    };

    const isAdaptiveHeight = currentStep !== 3 || currentStep !== 2
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        adaptiveHeight: isAdaptiveHeight,
        slidesToScroll: 1,
        arrows: false,
        swipe: false,
        beforeChange: (_, next) => {
            console.log("Navigating to slide:", next);
            setCurrentStep(next);
        },
    };

    const fetchAgentCountFromUser = async () => {
        try {
            const response = await listAgents()
            const filterAgents = await response.filter(res => res.userId === userId)
            setAgentCount(filterAgents.length)
        } catch (error) {
            console.log(error)
        }
    }
    const sanitize = (str) => String(str || "").trim().replace(/\s+/g, "_");
    const dynamicAgentName = `${sanitize(business?.businessType)}_${sanitize(business?.businessName)}_${sanitize(role_title)}_${packageValue}#${agentCount}`
    const handleContinue = async () => {
        if (step4Ref.current) {
            const isValid = step4Ref.current.validate();
            //creation here
            if (isValid && localStorage.getItem("UpdationMode") != "ON") {
                setLoading(true)

                
                const agentConfig = {
                    version: 0,
                    model: "gemini-2.0-flash-lite",
                    model_temperature: 0,
                    model_high_priority: true,
                    tool_call_strict_mode: true,
                    general_prompt: prompt1,

                    general_tools: [
                        {
                            type: "end_call",
                            name: "end_call",
                            description: "End the call with user.",
                        },

                    ],
                    states: [
                        {
                            name: "information_collection",
                            state_prompt:
                                "You will follow the steps below to collect information...",
                            edges: [
                                {
                                    destination_state_name: "appointment_booking",
                                    description: "Transition to book an appointment.",
                                },
                            ],
                            tools: [
                                {
                                    type: "transfer_call",
                                    name: "transfer_to_support",
                                    description: "Transfer to the support team.",
                                    transfer_destination: {
                                        type: "predefined",
                                        number: "+918054226461", // Replace with actual number
                                    },
                                },
                            ],
                        },
                        {
                            name: "appointment_booking",
                            state_prompt:
                                "You will follow the steps below to book an appointment...",
                            tools: [
                                {
                                    type: "book_appointment_cal",
                                    name: "book_appointment",
                                    description: "Book an annual check up.",
                                    cal_api_key: "cal_live_447bd92f96b6fc71e427e51cdc40e2cf",
                                    event_type_id: 2508223,
                                    timezone: "America/Los_Angeles",
                                },
                            ],
                        },
                    ],


                    // ],
                    starting_state: "information_collection",
                    begin_message: `Hey I am a virtual assistant ${agentName}, calling from ${business?.businessName}.`,
                    default_dynamic_variables: {
                        customer_name: "John Doe",
                    },
                };
                const knowledgeBaseId = sessionStorage.getItem("knowledgeBaseId");
                if (knowledgeBaseId) {
                    agentConfig.knowledge_base_ids = [knowledgeBaseId];
                }
                //Create LLm 
                try {
                    const llmResponse = await axios.post(
                        "https://api.retellai.com/create-retell-llm",
                        agentConfig,
                        {
                            headers: {
                                Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    sessionStorage.setItem("llmId", llmResponse.data.llm_id);
                    const llmId = llmResponse.data.llm_id;

                    const response_engine = {
                        type: "retell-llm",
                        llm_id: llmId,
                    };
                    const finalAgentData = {
                        response_engine,
                        voice_id: sessionStorage.getItem("agentVoice") || "11labs-Adrian",
                        language: sessionStorage.getItem("agentLanguageCode") || "en-US",
                        agent_name: dynamicAgentName || sessionStorage.getItem("agentName"),
                        language: "multi",
                        post_call_analysis_model: "gpt-4o-mini",
                        responsiveness: 1,
                        enable_backchannel: true,
                        interruption_sensitivity: 0.7,
                        backchannel_frequency: 0.7,
                        backchannel_words: ["Got it", "Yeah", "Uh-huh", "Understand", "Ok", "hmmm"],
                        post_call_analysis_data: [
                            {
                                type: "string",
                                name: "Detailed Call Summery",
                                description: "The name of the customer.",
                                examples: [
                                    "John Doe",
                                    "Jane Smith"
                                ]
                            },
                            {
                                type: "enum",
                                name: "lead_type",
                                description: "Feedback given by the customer about the call.",
                                choices: ["positive", "neutral", "negative"]
                            }
                        ],



                    };
                    // Create Agent Creation
                    try {
                        const response = await axios.post(
                            "https://api.retellai.com/create-agent",
                            finalAgentData,
                            {
                                headers: {
                                    Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
                                },
                            }
                        );
                        const agentId = response.data.agent_id;
                        // Get businessId from sessionStorage
                        const businessIdString = sessionStorage.getItem("businessId") || '{"businessId":1}';

                        // Convert string to object
                        const businessIdObj = JSON.parse(businessIdString);

                        // Now access the actual ID
                        const agentData = {
                            userId: userId,
                            agent_id: agentId || sessionStorage.getItem("agentId"),
                            knowledgeBaseId: sessionStorage.getItem("knowledgeBaseId"),
                            llmId: sessionStorage.getItem("llmId"),
                            avatar: sessionStorage.getItem("avatar") || "",
                            agentVoice: sessionStorage.getItem("agentVoice") || "11labs-Adrian",
                            agentAccent: sessionStorage.getItem("agentVoiceAccent") || "American",
                            agentRole: sessionStorage.getItem('agentRole') || "Genral Receptionist",
                            agentName: sessionStorage.getItem('agentName') || "",
                            agentLanguageCode: sessionStorage.getItem('agentLanguageCode') || "en-US",
                            agentLanguage: sessionStorage.getItem('agentLanguage') || "English (US)",
                            agentGender: sessionStorage.getItem('agentGender') || "female",
                            agentPlan: "free" || "Plus",
                            agentStatus: true,
                            businessId: businessIdObj.businessId,
                            responsiveness: 1,
                            enable_backchannel: true,
                            interruption_sensitivity: 0.7,
                            backchannel_frequency: 0.7,
                            backchannel_words: ["Got it", "Yeah", "Uh-huh", "Understand", "Ok", "hmmm"],
                        }
                        try {
                            const response = await createAgent(agentData);
                            if (response.status === 200 || response.status === 201) {
                                sessionStorage.setItem("agentId", response.data.agent_id);
                                sessionStorage.setItem("agentStatus", true);
                                setPopupType("success");
                                setPopupMessage("Agent created successfully!");
                                setShowPopup(true);
                                setTimeout(() => navigate("/dashboard"), 1500);
                                setLoading(false)
                                sessionStorage.clear()

                            }
                        } catch (error) {
                            // console.log(error,error.status)
                            if (error?.status == 400) {
                                // console.log('errorinside',error)
                                setPopupType("failed");
                                setPopupMessage(error?.response?.data?.message);
                                setShowPopup(true);
                                setLoading(false)
                            } else {
                                console.error("Agent creation failed:", error);
                                setPopupType("failed");
                                setPopupMessage("Agent creation failed while saving data in Database. Please try again.");
                                setShowPopup(true);
                                setLoading(false)
                            }


                        }


                    } catch (err) {
                        console.error("Upload failed:", err);
                        setPopupType("failed");
                        setPopupMessage("Agent creation failed.");
                        setShowPopup(true);
                        setLoading(false)
                    }
                } catch (error) {
                    console.error("LLM creation failed:", error);
                    setPopupType("failed");
                    setPopupMessage("LLM creation failed. Please try again.");
                    setShowPopup(true);
                    setLoading(false)
                }



                setLoading(false)
            }

            //updation here
            if (isValid && localStorage.getItem("UpdationMode") == "ON") {
                setLoading(true)
                const agentConfig = {
                    general_prompt: prompt1,
                    begin_message: `Hey I am a virtual assistant ${agentName}, calling from ${business?.businessName}.`,
                };
                const llm_id=localStorage.getItem('llmId')
                console.log('llm_id',llm_id)
                //Create LLm 
                try {
                    const llmResponse = await axios.patch(
                        `https://api.retellai.com/update-retell-llm/${llm_id} `,
                        agentConfig,
                        {
                            headers: {
                                Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    console.log('llmResponseupdate',llmResponse)
                    sessionStorage.setItem("llmId", llmResponse.data.llm_id);
                    const llmId = llmResponse.data.llm_id;

                    const finalAgentData = {
                        voice_id: sessionStorage.getItem("agentVoice") || "11labs-Adrian",
                        language: sessionStorage.getItem("agentLanguageCode") || "en-US",
                        agent_name: dynamicAgentName || sessionStorage.getItem("agentName"),
                        language: sessionStorage.getItem("agentLanguageCode") || "en-US",
                        normalize_for_speech: true,
                    };
                    // update Agent Creation
                    const agent_id=localStorage.getItem('agent_id')
                    try {
                        const response = await axios.patch(
                            `https://api.retellai.com/update-agent/${agent_id}`,
                            finalAgentData,
                            {
                                headers: {
                                    Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
                                },
                            }
                        );
                        console.log('agent update ',response)
                        const agentId = response.data.agent_id;
                        // Get businessId from sessionStorage
                        const businessIdString = sessionStorage.getItem("businessId") ;

                        // Convert string to object
                        const businessIdObj = JSON.parse(businessIdString);

                        // Now access the actual ID
                        const agentData = {
                            userId: userId,
                            agent_id: agentId || sessionStorage.getItem("agentId"),
                            knowledgeBaseId: sessionStorage.getItem("knowledgeBaseId"),
                            llmId: sessionStorage.getItem("llmId"),
                            avatar: sessionStorage.getItem("avatar") || "",
                            agentVoice: sessionStorage.getItem("agentVoice") || "11labs-Adrian",
                            agentAccent: sessionStorage.getItem("agentVoiceAccent") || "American",
                            agentRole: sessionStorage.getItem('agentRole') || "Genral Receptionist",
                            agentName: sessionStorage.getItem('agentName') || "",
                            agentLanguageCode: sessionStorage.getItem('agentLanguageCode') || "en-US",
                            agentLanguage: sessionStorage.getItem('agentLanguage') || "English (US)",
                            agentGender: sessionStorage.getItem('agentGender') || "female",
                            agentStatus: true,
                            businessId: businessIdObj.businessId,
                        }
                        try {
                            const response = await updateAgent(agentId,agentData);
                            if (response.status === 200 || response.status === 201) {
                                // sessionStorage.setItem("agentId", response.data.agent_id);
                                // sessionStorage.setItem("agentStatus", true);
                                setPopupType("success");
                                setPopupMessage("Agent Updated successfully!");
                                setShowPopup(true);
                                setTimeout(() => navigate("/dashboard"), 1500);
                                setLoading(false)
                                sessionStorage.clear()
                                    localStorage.removeItem('UpdationMode')
                                    localStorage.removeItem('agentName')
                                    localStorage.removeItem('agentGender')
                                    localStorage.removeItem('agentLanguageCode')
                                    localStorage.removeItem('agentLanguage')
                                    localStorage.removeItem('llmId')
                                    localStorage.removeItem('agent_id')
                                    localStorage.removeItem('knowledgeBaseId')
                                    localStorage.removeItem('agentRole')
                                    localStorage.removeItem('agentVoice')
                                    localStorage.removeItem('agentVoiceAccent')
                                    localStorage.removeItem('avatar')
                                    setHasFetched(false)
                            }
                            console.log('response server',response)
                        } catch (error) {
                            // console.log(error,error.status)
                            if (error?.status == 400) {
                                // console.log('errorinside',error)
                                setPopupType("failed");
                                setPopupMessage(error?.response?.data?.message);
                                setShowPopup(true);
                                setLoading(false)
                            } else {
                                console.error("Agent Updation failed:", error);
                                setPopupType("failed");
                                setPopupMessage("Agent Updation failed while saving data in Database. Please try again.");
                                setShowPopup(true);
                                setLoading(false)
                            }


                        }


                    } catch (err) {
                        console.error("Upload failed:", err);
                        setPopupType("failed");
                        setPopupMessage("Agent creation failed.");
                        setShowPopup(true);
                        setLoading(false)
                    }
                } catch (error) {
                    console.error("LLM updation failed:", error);
                    setPopupType("failed");
                    setPopupMessage("LLM updation failed. Please try again.");
                    setShowPopup(true);
                    setLoading(false)
                }



                setLoading(false)
            }
        }
    };
    const handleValidationError = ({ type, message }) => {
        setPopupType(type);
        setPopupMessage(message);
        setShowPopup(true);
    };
    const stepTitles = [
        "Agent Language Supported",
        "Agent Gender",
        "",
        "Receptionist Type",
    ];
    // function lock
    useEffect(() => {
        fetchAgentCountFromUser()
    }, [])
    return (
        <div className={styles.container}>
            <StepHeader title={stepTitles[currentStep]} />
            <Slider ref={sliderRef} {...settings}>
                {/* Step 1 */}
                <div>
                    <div className={styles.slideContent}>
                        <div className={styles.grid}>
                            {languages.map((lang, index) => (
                                <label
                                    key={index}
                                    className={`${styles.card} ${selectedLang === lang.name ? styles.active : ""
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="language"
                                        value={lang.name}
                                        checked={selectedLang === lang.name}
                                        onChange={() => {
                                            setSelectedLangCode(lang.locale);
                                            setSelectedLang(lang.name);
                                        }}
                                        className={styles.radioInput}
                                    />
                                    <div className={styles.flagWrapper}>
                                        <img
                                            src={`https://flagcdn.com/w80/${lang.locale
                                                ?.split("-")[1]
                                                ?.toLowerCase()}.png`}
                                            alt={lang.name}
                                            className={styles.flag}
                                        />
                                    </div>

                                    <p className={styles.langName}>{lang.name}</p>
                                    {/* <p className={styles.stats}>{lang.percentage} · {lang.stats}</p> */}
                                    {selectedLang === lang.name && (
                                        <span className={styles.langDot}></span>
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Step 2 */}
                <div>
                    <Step2
                        ref={step2Ref}
                        onNext={handleNext}
                        onBack={handleBack}
                        onValidationError={handleValidationError}
                    />
                </div>
                {/* Step 3 */}
                <div className={styles.Step3Container}>
                    <Step3
                        ref={step3Ref}
                        onNext={handleNext}
                        onBack={handleBack}
                        onValidationError={handleValidationError}
                    />
                </div>
                {/* Step 4 */}

                <div>
                    <Step4
                        ref={step4Ref}
                        onNext={handleNext}
                        onBack={handleBack}
                        onValidationError={handleValidationError}
                        loading={loading}
                        setLoading={setLoading}
                    />
                </div>


            </Slider>

            {/* === Footer Fixed Pagination === */}
            <div className={styles.footerFixed}>
                {/* Step dots */}
                <div className={styles.stepsIndicator}>
                    {[...Array(totalSlides)].map((_, idx) => (
                        <span
                            key={idx}
                            className={`${styles.stepDot} ${currentStep === idx ? styles.activeDot : ''}`}
                            onClick={async () => {
                                // Step 0 validation (language)
                                if (currentStep === 0 && !selectedLang) {
                                    setShowPopup(true);
                                    setPopupType("failed");
                                    setPopupMessage("Please select a language first.");
                                    return;
                                }

                                // Step 1 validation (gender + voice)
                                if (currentStep === 1 && step2Ref.current && !step2Ref.current.validate()) {
                                    return;
                                }

                                // Step 2 validation
                                if (currentStep === 2 && step3Ref.current && !step3Ref.current.validate()) {
                                    return;
                                }

                                // Step 3 validation
                                if (currentStep === 3 && step4Ref.current && !step4Ref.current.validate()) {
                                    return;
                                }

                                // Allow dot click to change slide
                                sliderRef.current?.slickGoTo(idx);
                            }}
                        />
                    ))}
                </div>


                {/* <div className={styles.navBtn} onClick={handleNext}>
                    <img src="svg/arrow.svg" alt="arrow" className={styles.arrowIcon} />
                </div> */}
                {currentStep < totalSlides - 1 && (
                    <button className={styles.navBtn} onClick={handleNext}>
                        <img src="svg/arrow.svg" alt="arrow" className={styles.arrowIcon} />
                    </button>
                )}
                {currentStep === totalSlides - 1 && (
                    <button className={styles.navBtn} onClick={handleContinue}>
                        {
                            loading ? <><Loader size={20} /></> : <img src="svg/arrow.svg" alt="arrow" className={styles.arrowIcon} />
                        }
                    </button>
                )}

            </div>




            {showPopup && (
                <PopUp
                    type={popupType}
                    onClose={() => setShowPopup(false)}
                    message={popupMessage}
                />
            )}
        </div>
    );
};

export default Step;
