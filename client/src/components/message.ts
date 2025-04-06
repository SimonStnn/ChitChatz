export default (from: string, content: string) => {
  const li = $("<li>").addClass("message");
  const title = $("<span>").text(from);
  const text = $("<p>").text(content);
  li.append(title)
    .append(text)
    .attr(
      "data-time",
      new Date().toLocaleDateString(window.navigator.language, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    );

  // Add a context menu
  li.on("contextmenu", (event) => {
    event.preventDefault();

    // Remove any existing custom menu
    $(".message-context-menu").remove();

    // Create the custom menu
    const menu = $("<menu>").addClass("message-context-menu").css({
      top: event.pageY,
      left: event.pageX,
    });

    // Add menu options
    $("<li>")
      .text("Copy Content")
      .addClass("menu-item info")
      .on("click", () => {
        navigator.clipboard.writeText(content);
        menu.remove();
      })
      .appendTo(menu);
    $("<li>")
      .text("Copy Sender")
      .addClass("menu-item info")
      .on("click", () => {
        navigator.clipboard.writeText(from);
        menu.remove();
      })
      .appendTo(menu);
    $("<li>")
      .text("Delete Message")
      .addClass("menu-item danger")
      .attr(
        "title",
        "This action deletes the message only for you. Other users will still see it."
      )
      .on("click", () => {
        li.remove();
        menu.remove();
      })
      .appendTo(menu);

    // Append the menu to the body
    $("body").append(menu);

    // Remove the menu when clicking elsewhere
    $(document).on("click", () => {
      menu.remove();
    });
  });

  return li;
};
