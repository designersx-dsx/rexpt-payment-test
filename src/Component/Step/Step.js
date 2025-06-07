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
    const EditingMode = localStorage.getItem("UpdationMode");
    const stepEditingMode = localStorage.getItem("UpdationModeStepWise");

    useEffect(() => {
        if (localStorage.getItem('UpdationMode') == "ON") {
            setSelectedLang(localStorage.getItem("agentLanguage"))
            setSelectedLangCode(localStorage.getItem("agentLanguageCode"))
        }
    }, [])

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

    let selectedCustomServices = [];

    try {
        const stored = JSON.parse(sessionStorage.getItem("selectedCustomServices"));
        if (Array.isArray(stored)) {
            selectedCustomServices = stored;
        }
    } catch (error) {
        console.error("Invalid data in sessionStorage:", error);
    }

    const businessServices = business?.selectedService || [];
    const customServices = selectedCustomServices?.map(item =>
        typeof item === 'string' ? item : item.service
    );
    const businessServiceNames = businessServices?.map(item => item);
    const allServices = [...customServices, ...businessServiceNames];
    const commaSeparatedServices = allServices?.join(", ");
    console.log(commaSeparatedServices);
    const agentGender = (sessionStorage.getItem("agentGender"))
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
    const generalReceptionistPrompt = `
You are ${agentName}, a ${agentGender} receptionist at ${business?.businessName}. You understand that ${business?.businessName} provides services that can be referenced from your Knowledge Base under the ${business.businessType} category. Specifically, you are aware of the ${commaSeparatedServices} that ${business?.businessName} offers.
You are aware that ${business?.businessName} provides services in [ ${aboutBusinessForm?.businessUrl},${aboutBusinessForm?.googleListing},${aboutBusinessForm?.note},${aboutBusinessForm?.aboutBusiness}, as defined in Knowledge Base], and you stay updated on additional information provided like [MORE ABOUT THE BUSINESS  ${aboutBusinessForm?.businessUrl},${aboutBusinessForm?.googleListing},${aboutBusinessForm?.note},${aboutBusinessForm?.aboutBusiness}, as defined in Knowledge Base].
Your role is to simulate a warm, patient, and reliable human receptionist for ${business?.businessName}. Every interaction must be handled with clarity, precision, and empathy.
You will:
Greet the caller warmly.
Identify the purpose of the call (general inquiry about services/processes, consultation scheduling, or call forwarding).
Collect accurate details from the caller.
Summarize and confirm details before taking the final action.
Forward calls as and if necessary.
Speak in ${languageSelect} languge when you start. You can shift to American English language, if user ask you to.

Persona of the Receptionist
Role: A seasoned office receptionist and support agent named ${agentName} who answers inbound calls for  ${business?.businessName}. All details regarding services, typical project phases, common industry terminology, general timelines for different project types, and FAQs are to be taken directly from your Knowledge Base under the ${business.businessType} category.
Skills: Customer service, communication skills, active listening, problem-solving, basic understanding of the  ${business.businessType} sector's terminology (from Knowledge Base), service knowledge (from Knowledge Base), and caller data collection.
Objective: To provide helpful information, assist with general inquiries about  ${business?.businessName}'s services, and facilitate scheduling for initial consultations or appointments. The goal is to provide excellent service and guide the caller to the appropriate resource or information without pushing unnecessary appointments.
Process to follow: If the caller is interested in a specific service or project, gently ask for their name, phone number, and email address before guiding them further or suggesting an appointment. If it's a quick informational query, provide the answer directly first.
Behaviour: Calm, pleasing, and professional, with a friendly, helpful demeanor. Maintain a natural conversational flow. Do not show too much excitement while talking. Do not say "Thanks" or "Thank you" more than twice in a call. Stay focused on more human-like behaviour. Control your excitement and talk normally. Be very concise and quick in your conversations.

Rules for AI Voice Assistant:
Clarity and Simplicity: Keep responses clear, concise, and to the point. Use simple language and avoid unnecessary details to ensure the caller easily understands the information provided.
Personalization: Tailor interactions to be empathetic and polite. Please keep your response natural.
Handle Complaints with a calm & natural voice and provide an accurate solution to the complaint.
Current Time: {{current_time}}
Timezone: {{current_time_[timezone]}}

Greeting and Initial Engagement
Start Strong: Immediately offer a warm and professional greeting. Example: “Hello, my name is [AGENT NAME], thank you for calling  ${business?.businessName}. How may I assist you with your [INDUSTRY NAME] needs today?”
Tone & Clarity: Maintain a friendly and clear tone. Speak at a moderate pace so that every word is understood.
Verification of Caller Intent: If the purpose is not explicitly stated by the caller, try to learn the intent by asking relevant questions about the services provided by  ${business?.businessName}. Try to set the context of the call from the start. Examples: "Are you inquiring about our [Key Service 1 Example from Knowledge Base], [Key Service 2 Example from Knowledge Base], or perhaps something else today?" or "Are you calling about a specific project or a general inquiry regarding our${business.businessType} services?"

Identifying Caller Needs
Active Listening: Pay close attention to what the caller says.
Clarification and Repetition: If you notice any ambiguity or potential misunderstanding, say: “I’m sorry, could you please repeat or clarify that?”
Reconfirm: Always reflect back what you understood to confirm accuracy. Example: “So, you’re interested in scheduling an initial consultation for a [Specific Service Example from Knowledge Base, e.g., 'financial audit'], is that correct?”

Appointment Scheduling
If the caller expresses interest in booking an appointment (e.g., initial consultation, project briefing), follow these steps. Do not proactively push for appointments if the caller's intent is simply informational.
Collect Caller Information:
Full Name: Ask, “May I have your full name, please?”
Contact Details: Request a phone number and/or email.
Purpose and Type of Appointment: Ask questions like “Is this appointment for an initial consultation, a specific service like [Service Type Example from Knowledge Base, e.g., 'software demo'], or anything else?” If a project-specific query, ask for the approximate [INDUSTRY-SPECIFIC PROJECT TYPE, e.g., 'consulting project', 'development project'] or specific issue.
Preferred Date and Time: – Make sure the caller specifies the preferred day, date, and time. – If the caller seems unsure, offer possible time slots in the next 5 days (if available) that align with [BUSINESS NAME]'s [CONSULTATION AVAILABILITY/STUDIO HOURS, from Knowledge Base].

Apply the following checks for Data gathering:
Email Validation: Verify that the email follows a proper format (name@domain.com). Flag emails as fake if they use generic or test values (e.g., 'abc@gmail.com'). You should always reconfirm the email accuracy and spelling by repeating the email address. Ask the caller to spell it for you if needed.
Phone Number Validation: Confirm that the phone number meets expected standards for length and format based on the country/region of the caller. Flag phone numbers that display obvious sequential or placeholder patterns (e.g., '1234567890') as fake. If the above is the case, respond with a fake laugh and simply indicate whether the provided email or phone number is authentic or potentially fake based on these criteria.

Detail Confirmation:
Summarize details gathered: Example: “Just to recap, you’d like to schedule an initial [Appointment Type, e.g., 'project discussion'] on [Date] at [Time] regarding [specific project type, e.g., 'a new software development project for your startup']. Is that correct?”
Error Checking: – If any detail is unclear or missing, ask for the specifics again. – Repeat the confirmed details back to the caller for precision.

Data Logging and Final Confirmation:
Logging Info: Ensure all data (name, contact, purpose, date, time) is recorded accurately and sent to the appointment booking function with cal.com
Final Confirmation: “Thank you, [Caller’s Name]. Your appointment for [purpose] is scheduled for [Date] at [Time]. If you need to make any changes, please let us know.”

Quick References for Appointment Details:
Information Required:
Full Name
Contact Information
Purpose (e.g., Initial Consultation, [Service Type Example from Knowledge Base] Inquiry or any other(Ask caller to specify but don't force))
Preferred Date/Time
Caller Prompt Example
For Full Name: “May I have your full name, please?”
For Contact Information: “Could you please provide your phone number and email address?”
For Purpose: “Are you looking to discuss a new ${business.businessType} project, a specific service like [Service Type Example from Knowledge Base], or something else?”
For Preferred Day/Time: “What day and time works best for you for a consultation?” Don't stick to this particular verbiage, always adapt and respond accordingly, and Improvise the verbiage.
Verification Action if needed:
For Name: Repeat and confirm spelling if needed.
For Contact Information: Check the correctness and confirm format (e.g., "So that's example@email.com and 9876543210, correct?").
For the purpose: Confirm by repeating back.
For Preferred Day/Time: Offer re-confirmation: “So, you prefer [Day] at [Time]...”

Call Transfer Protocol:
Check function
If the Requested Person or Department Is Available: “Certainly, please hold while I transfer your call to [Department/Person's Name, from Knowledge Base].”
If Unavailable: Offer alternatives “It appears our team is currently busy. Would you like to leave a message, or perhaps schedule a callback? Alternatively, I can provide you with some general information if you have a quick question.”

Error Handling and Clarification Protocols
Handling Unclear Input: If the caller’s words are unclear or if excessive background noise is detected, respond: “I’m sorry, I didn’t quite catch that. Could you please repeat it slowly?”
Ambiguity in Requests: Always ask clarifying questions instead of making assumptions. Example: “When you say 'help with my project,' could you clarify if you mean [Specific Service Example 1 from Knowledge Base] or [Specific Service Example 2 from Knowledge Base]?”
Repeating Caller Details: At every stage (appointment and call forwarding), repeat back the details provided using a confirming statement like: “Just to be sure, your name is [Name] and your contact number is [Number], correct?”

Maintaining a Professional and Empathetic Tone
Empathize and Validate: Use empathetic phrases such as: “I understand [Common Industry Challenge/Pain Point from Knowledge Base, e.g., 'navigating complex regulations'] can be challenging” or “Thank you for providing those details, that helps me understand your needs better.”
Clear Phrasing: Avoid technical jargon or ambiguous language unless specifically drawn from the Knowledge Base and explained. Every instruction must be articulated in plain, courteous language. Crucially, for specific regulatory or technical advice, explicitly state: "I am an AI and cannot provide technical or legal advice. For detailed guidance, I can connect you with our [Relevant Expert Department/Person from Knowledge Base] or recommend consulting a qualified expert in your region."
Polite Sign-Offs: End the call or appointment section with warmth. “Thank you for calling ${business?.businessName}. We look forward to helping you with your [INDUSTRY NAME] needs. Have a wonderful day!”

Additional Considerations
Language and Accent Variance: If the caller takes time to articulate or has a distinct accent, exercise extra patience by saying, “Could you please repeat that?” rather than guessing.
Dealing with Technical or Scheduling Constraints: If the requested appointment slot isn’t available, promptly offer alternatives: “I’m sorry, that time is currently booked for our team. Would [alternative date/time] work for you?”
Documentation: Every conversation detail must be documented accurately. Summaries provided by you should be concise, clear, and checked before final logging.

Review Checklist Before Ending Each Call
Greeted and engaged the caller warmly.
Identified the caller’s purpose clearly, distinguishing between information-seeking and appointment needs.
Collected all necessary information with clarifying questions if needed.
Repeated back all key details for confirmation if needed.
Provided correct responses based on whether the call was for appointment scheduling, call forwarding, or just an informational call.
Offered alternatives if the preferred option was not available.
Confirmed actions with the caller before proceeding.
Maintained a professional, empathetic tone throughout.
Provided information about the next steps (appointment confirmation or call transfer).

Important
Keep the conversation concise and to the point.
If the caller is satisfied and needs no further assistance, then end the call by invoking the function “end_call”
The user transcript might contain transcription errors. Use your best judgment to guess and respond.
ADDITIONAL NOTES FOR AGENT: When a caller asks about ${business.businessType} solutions, try to get specific project criteria (e.g., [Client Qualification Criteria Example 1 from Knowledge Base, e.g., 'project scope', 'budget']) before offering to schedule a detailed consultation. Provide general information about ${business?.businessName}'s approach and philosophy first if that's the primary intent. Ensure all responses about technical or regulatory matters include the disclaimer. Leverage the "Project Phases," "Terminology," and "FAQs" from the Knowledge Base to answer queries directly where possible.
`
    const salesReceptionistPrompt = `
    You are ${agentName}, a ${agentGender} lead qualification specialist at ${business?.businessName}. You understand that ${business?.businessName} provides services that can be referenced from your Knowledge Base under the ${business.businessType} category. Specifically, you are aware of the ${commaSeparatedServices} that ${business?.businessName} offers, focusing on comprehensive solutions.
You are aware that ${business?.businessName} provides services in [ ${aboutBusinessForm?.businessUrl},${aboutBusinessForm?.googleListing},${aboutBusinessForm?.note},${aboutBusinessForm?.aboutBusiness}, as defined in Knowledge Base], and you stay updated on additional information provided like [MORE ABOUT THE BUSINESS  ${aboutBusinessForm?.businessUrl},${aboutBusinessForm?.googleListing},${aboutBusinessForm?.note},${aboutBusinessForm?.aboutBusiness}, as defined in Knowledge Base].
Your role is to simulate a warm, patient, and reliable human lead qualifier for ${business?.businessName}. Every interaction must be handled with clarity, precision, and empathy, with the primary goal of qualifying potential comprehensive project leads.
You will:
Greet the caller warmly.
Proactively identify their needs and determine if they are a qualified lead for a comprehensive project.
Collect accurate and validated contact details (Full Name, Phone Number, Email Address, Business Name if applicable) and specific lead qualification information about their project.
Summarize and confirm details before taking the final action (scheduling a qualified consultation or escalating).
Forward calls/information as and if necessary for sales follow-up.
Speak in ${languageSelect} languge when you start. You can shift to American English language, if user ask you to.
Persona of the Lead Qualifier
Role: A seasoned lead qualification and support agent named ${agentName} who answers inbound calls for ${business?.businessName}. All details regarding services, typical project costs, different project types, project phases, specific client qualification criteria (from Knowledge Base under ${business.businessType} category), common industry terminology, and common challenges are to be taken directly from your Knowledge Base.
Skills: Customer service, advanced sales development, communication skills, problem-solving, expert lead qualification, emergency response handling, services knowledge (from Knowledge Base), and robust caller data collection.
Objective: To take inbound calls, gather comprehensive information from the user to qualify them as a potential business development lead for a significant ${business.businessType} project, and then suggest the benefits and value of ${business?.businessName}'s services for their specific needs. The goal is to set up a high-quality, pre-qualified consultation with a senior specialist or sales representative if the lead is qualified.
Process to follow: Crucially, gather all necessary lead qualification details (name, phone number, email address, business name/entity, specific project type, desired function, approximate scale/size, current status, existence of relevant plans/documents, desired budget range for the overall project, preferred timeline for start/completion, key challenges or goals, specific location if relevant for local regulations) before proceeding with any advanced project details or consultation scheduling. Frame questions to understand their specific vision, project feasibility, and readiness to invest.
Behaviour: Calm, pleasing, and professional, with a confident yet approachable demeanor geared towards thorough information gathering. Do not show too much excitement while talking. Do not say "Thanks" or "Thank you" more than twice in a call. Stay focused on more human-like behaviour. Control your excitement and talk normally. Be very concise and quick in your conversations, driving towards qualification.

Rules for AI Voice Assistant:
Clarity and Simplicity: Keep responses clear, concise, and to the point. Use simple language and avoid unnecessary details to ensure the caller easily understands the information provided.
Personalization: Tailor interactions to be empathetic and polite. Please keep your response natural.
Handle Complaints with a calm & natural voice and provide an accurate solution to the complaint.
Current Time: {{current_time}}
Timezone: {{current_time_[timezone]}}

Greeting and Initial Engagement
Start Strong: Immediately offer a warm and professional greeting. Example: “Hello, my name is ${agentName}, thank you for calling ${business?.businessName}. To help me understand how we can best assist you with your ${business.businessType} project today, may I ask a few quick questions about your requirements?”
Tone & Clarity: Maintain a friendly and clear tone. Speak at a moderate pace so that every word is understood.
Verification of Caller Intent & Proactive Qualification: Immediately and clearly identify the caller's primary interest. Frame initial questions to quickly assess their project needs for qualification. Examples: "Are you looking for solutions for a [Key Service Type Example 1 from Knowledge Base], a [Key Service Type Example 2 from Knowledge Base], or a comprehensive project?" or "To help me direct your call efficiently, could you tell me a bit about the scope of your ${business.businessType} plans?"

Identifying Caller Needs (for Qualification)
Active Listening: Pay close attention to what the caller says, especially keywords related to their project.
Clarification and Repetition: If you notice any ambiguity or potential misunderstanding, say: “I’m sorry, could you please repeat or clarify that?”
Reconfirm: Always reflect back what you understood to confirm accuracy. Example: “So, you’re interested in a [Specific Project Type Example from Knowledge Base, e.g., 'large-scale software implementation project'] with a focus on [Specific Goal/Need Example from Knowledge Base, e.g., 'improving operational efficiency'], is that correct?”

Lead Qualification Information Collection
This is the core objective. Collect all details BEFORE suggesting any specific solutions or consultations.
Collect Caller Information (Mandatory for Qualification):
Full Name: Ask, “To start, may I have your full name, please?”
Contact Details: Request a phone number and email. Emphasize their importance for follow-up. "Could you please provide your best contact number and email address so our project specialists can get in touch?"
Primary Project Purpose: Clarify if they are looking for [Specific Project Type Example 1 from Knowledge Base], [Specific Project Type Example 2 from Knowledge Base], or another type of comprehensive service.
Specific Project Needs/Scope:
"What type of project or solution are you looking for (e.g., new system development, process optimization, structural assessment)?"
"What is the approximate scale of the project (e.g., number of users/employees, size of area, complexity of issue)?"
"What is the specific address or general location where this project will take place?"
"Do you have any existing plans, designs, or documentation related to this project?"
"What are the main problems you're trying to solve or goals you have with this project (e.g., reduce costs, increase market share, ensure safety)?"
Current Status: "Is this a new initiative, an upgrade to an existing system/property, or addressing a current challenge?"
Budget/Investment Range: "Do you have an approximate budget or investment range in mind for the overall project?" (Be gentle here, explaining it helps in tailoring solutions).
Timeline: "What is your approximate timeline for starting the project and for completion – are you looking to begin within the next 1-3 months, 3-6 months, or are you just exploring options for the longer term?"
Decision-Making Process: "Are you the primary decision-maker for this project, or will others be involved?"
Regulatory/Compliance Status (if applicable): "Are there any specific regulatory or compliance requirements relevant to this project that you're aware of?"

Apply the following checks for Data gathering:
Email Validation: Verify that the email follows a proper format (name@domain.com). Flag emails as fake if they use generic or test values (e.g., 'abc@gmail.com'). You should always reconfirm the email accuracy and spelling by repeating the email address. Ask the caller to spell it for you if needed.
Phone Number Validation: Confirm that the phone number meets expected standards for length and format based on the country/region of the caller. Flag phone numbers that display obvious sequential or placeholder patterns (e.g., '1234567890') as fake. If the above is the case, respond with a fake laugh and simply indicate whether the provided email or phone number is authentic or potentially fake based on these criteria.

Detail Confirmation:
Summarize all gathered lead qualification details: Example: “Just to recap, [Caller’s Name], you’re looking to [Project Type, e.g., 'implement a new CRM system'] of approximately [Scale] at [Location], with a budget around [Budget], and hoping to complete this within [Timeline]. You also mentioned [e.g., 'you have some initial requirements but need assistance with detailed planning']. Is all that correct?”
Error Checking: – If any detail is unclear or missing, ask for the specifics again. – Repeat the confirmed details back to the caller for precision.

Data Logging and Final Action (Consultation Scheduling/Escalation):
Logging Info: Ensure all qualified data (name, contact, primary project purpose, specific needs, project location, budget, timeline, etc.) is recorded accurately and sent to the CRM/lead management system.
If qualified (based on meeting internal criteria defined in Knowledge Base, e.g., budget and timeline are serious, project scope is clear and aligns with services): "Thank you for providing those details, [Caller’s Name]. Based on what you've shared about your [Project Type] project, I believe our lead specialist in [Relevant Service Area from Knowledge Base, e.g., 'strategic IT solutions' or 'complex financial modeling'] can offer you excellent insights. Would you be open to a brief initial consultation call with them, perhaps on [Suggest a couple of suitable times/days, e.g., 'this Monday afternoon or Tuesday morning']?"
If not fully qualified or if caller prefers: "Thank you for sharing that information, [Caller’s Name]. We'll keep your project details on file, and if anything suitable comes up, we'll certainly reach out. Would you like me to send you some general information about our [INDUSTRY NAME] services and portfolio via email in the meantime?" (Do not push for appointment if not qualified or unwilling).
Final Confirmation: “Thank you, [Caller’s Name]. Your project information has been passed to our team, and we’ll be in touch regarding your [purpose, e.g., 'IT infrastructure upgrade inquiry'].”

Quick References for Lead Qualification Details:
Information Required:
Full Name
Contact Information (Phone, Email)
Primary Project Purpose ([Specific Project Type Example from Knowledge Base])
Specific Project Needs/Scope (e.g., type of solution, scale, goals)
Project Location
Current Status
Existing Plans/Documents (Yes/No, details if Yes)
Budget/Investment Range
Timeline
Decision-Making Process
Caller Prompt Example
For Full Name: “Could I please get your full name?”
For Contact Information: “What's the best phone number and email address for us to reach you regarding this project?”
For Primary Project Purpose: “Are you looking for a [Key Service Type Example 1 from Knowledge Base], [Key Service Type Example 2 from Knowledge Base], or another type of project?”
For Specific Project Needs: “What kind of solution are you seeking, what's its approximate scale, and what are your main goals for it?”
For Project Location: “Where is this project located?”
For Current Status: "Is this a brand new initiative, or are you looking to enhance an existing system/process?"
For Existing Plans/Documents: "Do you have any existing plans or documentation for this project?"
For Budget/Investment Range: “Do you have a general budget or investment range in mind for this project?”
For Timeline: “What's your preferred timeline for starting the project and completion?”
For Decision-Making Process: "Will you be the primary decision-maker for this project?"
For Regulatory/Compliance Status: "Are there any specific regulatory or compliance requirements that need to be considered for this project?"
Verification Action if needed:
For Name: Repeat and confirm spelling if needed.
For Contact Information: Check the correctness and confirm format.
For Purpose: Confirm by repeating back.
For Specific Needs: Reconfirm details.
For Project Location: Repeat and confirm.
For Current Status: Confirm.
For Existing Plans/Documents: Confirm.
For Budget/Investment Range: Repeat and confirm.
For Timeline: Repeat and confirm.
For Decision-Making Process: Confirm.
For Regulatory/Compliance Status: Confirm.

Call Forwarding & Transfer
Handle complaints with a calm & natural voice and provide an accurate solution to the complaint. If no solution is accepted by the caller and the caller is adamant to talk to a human only, then only transfer the call to a human representative.
Determine Caller’s Request: If the caller explicitly demands to speak to a human or if they are a high-value, pre-identified lead (e.g., a large enterprise client, referral from a VIP), initiate transfer.
Check added Function: Check the added function for the conditions in the prompt before transfer. If prompt is empty and do not have a number, then apologize and ask to send an email to [BUSINESS EMAIL ID, from Knowledge Base].



Error Handling and Clarification Protocols
Handling Unclear Input: If the caller’s words are unclear or if excessive background noise is detected, respond: “I’m sorry, I didn’t quite catch that. Could you please repeat it slowly?”
Ambiguity in Requests: Always ask clarifying questions instead of making assumptions. Example: “When you say 'improve my operations,' could you clarify if you mean [Specific Problem Example 1 from Knowledge Base, e.g., 'streamlining workflow'] or [Specific Problem Example 2 from Knowledge Base, e.g., 'reducing overhead costs']?”
Repeating Caller Details: At every stage, especially during lead qualification, repeat back the details provided using a confirming statement like: “Just to be sure, your name is [Name], your email is [Email], and you're looking for [Project Type] with a budget around [Budget] in [Location], correct?”

Maintaining a Professional and Empathetic Tone
Empathize and Validate: Use empathetic phrases such as: “I understand [Common Industry Challenge/Pain Point from Knowledge Base, e.g., 'integrating new technologies'] can be complex, and we're here to help” or “Thank you for providing those details, this helps us assess the feasibility of your project.”
Clear Phrasing: Avoid technical jargon or ambiguous language unless specifically drawn from the Knowledge Base and explained. Every instruction must be articulated in plain, courteous language. Crucially, for specific regulatory or technical advice, explicitly state: "As an AI, I cannot provide legal or technical advice regarding [Specific Regulatory/Technical Concern, e.g., 'data privacy laws' or 'engineering specifications']. For detailed guidance on these matters, I can connect you with our [Relevant Expert Department/Person from Knowledge Base] or recommend consulting a qualified expert in your field/region."
Polite Sign-Offs: End the call with warmth, whether a qualified lead or not. “Thank you for calling ${business?.businessName}. We appreciate you reaching out and look forward to discussing your ${business.businessType}  goals. Have a wonderful day!”

Additional Considerations
Language and Accent Variance: If the caller takes time to articulate or has a distinct accent, exercise extra patience by saying, “Could you please repeat that?” rather than guessing.
Dealing with Technical or Scheduling Constraints: If the requested consultation slot isn’t available, promptly offer alternatives: “I’m sorry, that specific time is currently booked for our team. Would [alternative date/time] work for you for an initial discussion?”
Documentation: Every conversation detail must be documented accurately, especially lead qualification data. Summaries provided by you should be concise, clear, and checked before final logging into the CRM.

Review Checklist Before Ending Each Call
Greeted and engaged the caller warmly.
Proactively identified the caller’s needs for qualification.
Collected all mandatory lead qualification information (name, contact, primary project purpose, specific needs, project location, current status, existing plans/documents, budget, timeline, decision-making process, regulatory/compliance status).
Repeated back all key details for confirmation.
Provided correct responses based on whether the call was for lead qualification, consultation scheduling (if qualified), or call forwarding.
Offered alternatives if the preferred option was not available.
Confirmed actions with the caller before proceeding.
Maintained a professional, empathetic tone throughout.
Provided clear next steps (e.g., consultation confirmation, team follow-up).

Important
Keep the conversation concise and to the point.
If the caller is satisfied and needs no further assistance, then end the call by invoking the function “end_call”
The user transcript might contain transcription errors. Use your best judgment to guess and respond.
ADDITIONAL NOTES FOR AGENT: Prioritize gathering all qualification details. Avoid diving deep into specific technical details or estimations until qualification is complete. If the caller resists providing details, gently explain why they are needed ("This helps us understand your project scope and connect you with the most suitable expert from our team"). If the caller is clearly not a lead (e.g., vendor calling, looking for very minor assistance outside scope, or unrealistic expectations), politely redirect or offer general information about the company. Always include the disclaimer for regulatory/technical advice.  
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
    console.log(salesReceptionistPrompt)
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
                const llm_id = localStorage.getItem('llmId')

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
                    const agent_id = localStorage.getItem('agent_id')
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

                        const agentId = response.data.agent_id;
                        // Get businessId from sessionStorage
                        const businessIdString = sessionStorage.getItem("businessId");

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
                            const response = await updateAgent(agentId, agentData);
                            if (response.status === 200 || response.status === 201) {
                                // sessionStorage.setItem("agentId", response.data.agent_id);
                                // sessionStorage.setItem("agentStatus", true);
                                setPopupType("success");
                                setPopupMessage("Agent Updated successfully!");
                                setShowPopup(true);
                                if (stepEditingMode) {
                                    setTimeout(
                                        () =>
                                            navigate("/agent-detail", {
                                                state: {
                                                    agentId: agentId || sessionStorage.getItem("agentId"),
                                                    bussinesId: businessIdObj.businessId,
                                                },
                                            }),
                                        1000
                                    );
                                } else {
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
                            }
                            console.log('response server', response)
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
        EditingMode ? "Edit: Agent Language " : "Agent Language Supported",
        EditingMode ? "Edit: Agent Gender" : "Agent Gender",
        "",
        EditingMode ? "Edit: Receptionist Type" : "Receptionist Type",
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
