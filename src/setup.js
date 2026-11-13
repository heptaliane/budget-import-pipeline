function setupFormTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === "onFormSubmit") {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  const form = FormApp.openById(config.trigger_form_id);
  ScriptApp.newTrigger("onFormSubmit")
    .forForm(form)
    .onFormSubmit()
    .create();

  console.log(`Successfully bound onFormSubmit trigger to Form: ${form.getTitle()}`);
}
