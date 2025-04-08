export default function on_ws_error(event: Event) {
  console.error("WebSocket error observed:", event);

  const errorDialog = $("#error-dialog");
  const errorContent = $("#error-dialog #error-dialog-content");
  const errorButton = $("#error-dialog button");

  errorDialog.prop("open", true);

  if (event.type === "close" || event.type === "error") {
    // If the WebSocket failed to connect, allow the user to reload the page
    errorContent.text("Connection lost. Please try reconnecting.");
    errorButton.text("Reconnect").prop("disabled", false);
    errorButton.off("click").on("click", () => {
      location.reload();
    });
  } else {
    // Otherwise, disable the button and display error information
    errorContent.text("WebSocket error observed: " + event.toString());
    errorButton.text("Close").prop("disabled", true);
  }
}
