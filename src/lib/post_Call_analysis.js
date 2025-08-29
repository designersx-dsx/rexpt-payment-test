export default function getBusinessSpecificFields(businessType) {
    if (businessType === "Restaurant") {
        return [
            {
                type: "string",
                name: "order_details",
                description: "Extract order items in JSON-like format",
                examples: [
                    '[{"item":"Paneer Butter Masala","qty":2},{"item":"Pizza Margherita","qty":1}]',
                    '[{"item":"Burger","qty":1},{"item":"Coke","qty":2}]'
                ],
            }
        ];
    }

    return [];
}


