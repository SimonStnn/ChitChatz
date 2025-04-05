export default (from: string, content: string) => {
  const li = $("<li>").addClass("message");
  const title = $("<span>").text(from);
  const text = $("<p>").text(content);
  li.append(title).append(text).attr("data-time", new Date().toISOString());

  return li;
};
