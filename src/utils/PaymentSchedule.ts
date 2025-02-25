
export const generateRepaymentSchedule = ({ disbursementDate, principal, tenure, emiFrequency, interestRate, moratorium }:any) => {
    let schedule = [];
    let outstanding = principal;
    let ratePerPeriod = (interestRate / 100) / (emiFrequency === "monthly" ? 12 : 4);
    let numPayments = tenure * (emiFrequency === "monthly" ? 12 : 4);
    let startDate = new Date(disbursementDate);
    let moratoriumEnd = new Date(startDate);
    moratoriumEnd.setMonth(moratoriumEnd.getMonth() + moratorium);

    let emi = (principal * ratePerPeriod * Math.pow(1 + ratePerPeriod, numPayments)) / (Math.pow(1 + ratePerPeriod, numPayments) - 1);
    
    for (let i = 0; i < numPayments; i++) {
        let dueDate = new Date(moratoriumEnd);
        dueDate.setMonth(dueDate.getMonth() + (emiFrequency === "monthly" ? i : i * 3));

        let interest = outstanding * ratePerPeriod;
        let principalComponent = emi - interest;
        outstanding -= principalComponent;

        schedule.push({
            installment: i + 1,
            dueDate: dueDate.toISOString().split("T")[0],
            principalComponent: principalComponent.toFixed(2),
            interestComponent: interest.toFixed(2),
            emi: emi.toFixed(2),
            outstanding: outstanding > 0 ? outstanding.toFixed(2) : "0.00"
        });

        if (outstanding <= 0) break;
    }

    return schedule;
};