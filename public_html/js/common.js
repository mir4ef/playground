// Miroslav Georgiev

$(document).ready(function()
{
    // load the data for the dropdowns and populate them
    $.ajax({
        type: "get",
        url: "data/data.xml",
        dataType: "xml",
        success: function(xml)
        {
            $(xml).find('dropdown').each(function()
            {
                var row = "<div class='row'>";
                var label = "<label>";
                var title = "";
                var menu = "<div class='dropdown-menu'><a class='current-selection'>";
                var menuoptions = "<ul class='menu-options'>";
                var option = "";
                
                // loop through each label
                $(this).find("label").each(function()
                {
                    title = $(this).text();
                    row = row + label + title + ":</label>" + menu;
                });
                
                // loop through each option
                $(this).find("option").each(function(index)
                {
                    option = $(this).text();
                    if (index === 0)
                        row = row + option + "</a><img src='assets/arrow-down.png' alt='icon' />" + menuoptions + "<li class='selected'><a href='#'>" + option + "</a></li>";
                    else
                        row = row + "<li><a href='#'>" + option + "</a></li>";
                });
                row = row + "</ul></div>";
                $("form").append(row);

                // show the menu options on click
                $(".current-selection, .dropdown-menu img").click(function()
                {
                    $(this).parent().children(".menu-options").show();
                });

                // handle option selections
                $(".menu-options li").click(function()
                {
                    // check if the option has already been selected
                    if (!$(this).hasClass("selected"))
                    {
                        // update the menu header with the selection
                        var selection = $(this).children().text();
                        var menuheader = $(this).parent().parent().children("a");
                        $(menuheader).text(selection);

                        // deselect the highlighted option
                        $(this).parent().children().removeClass("selected");

                        // highlight the selected option in the dropdown
                        $(this).addClass("selected");
                    }

                    // hide the menu after a selection has been made
                    $(this).parent().hide();
                });

                // hide the menu if clicked outside
                $("html").on("mouseup touchend", function(e)
                {
                    if ($(".menu-options").has(e.target).length === 0)
                        $(".menu-options").hide();
                });
            });
        },
        error: function()
        {
            var msg = "Could not load the data! Please check tha path or try again later.";
            $("form").append(msg);
        }
    });
});