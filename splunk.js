require([
    'underscore',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/searchmanager',
    '../app/test/components/ModalViewComponentSimple',
    'splunkjs/mvc/simplexml/ready!'
], function(_, $, mvc, TableView, SearchManager, ModalViewComponentSimple) {
    console.log("LAZY!!!");
    var comment = ""
    var session = ""
    var service = mvc.createService({ owner:"nobody" });
    var search = mvc.Components.get("search1");
    var CustomRangeRenderer = TableView.BaseCellRenderer.extend({
        canRender: function(cell) {
            return true;
        },
        render: function($td, cell) {
             switch(cell.field.toUpperCase())
                    {
                        case "JSESSIONID":
                            session = cell.value;
                            break;
                        case "COMMENT":
                            comment = cell.value;
                            break;
                        default:
                    }
            if (cell.field === "comment") {
                var full = { 'session':session, 'comment':comment , 'service':service, 'search':search }
                var strHtmlInput = "<div style='cursor: pointer;'>" + cell.value + "</div>"
                $td.append(strHtmlInput).on("click", function(e) {
                    showPopup(cell.value, full)
                });
            } else {
                  $td.html(cell.value)
           } 
        }
    });

    var sh = mvc.Components.get("tblSimple");
    if (typeof(sh) != "undefined") {
        sh.getVisualization(function(tableView) {
            // Add custom cell renderer and force re-render
            tableView.table.addCellRenderer(new CustomRangeRenderer());
            tableView.table.render();
        });
    }

    function showPopup(strCellValue, full) {
        console.log("test", full['session'])
	var subject = "Comment for session " + full['session']
	var comment = full['comment']
	console.log(subject)
        var modal = new ModalViewComponentSimple({
            title: subject,
            session: full['session'],
            search: full['search'],
	    comment: full['comment'],
            service: full['service'],
            id: "model_table_5",
            display_component: {
                viz_options: {
                    template: `
                    <div class="form-horizontal form-small content">
                        <div class="form-group control-group"><div class="control-label col-sm-2">
                            <p> Summary: </p>
                        </div>
                        <div class="col-sm-6 controls control-placeholder">
                            <div class="control shared-controls-textcontrol control-default" >
                                <span class="uneditable-input " data-role="uneditable-input" style="display:none"></span>
                                <textarea id="summary" name="summary" rows="4" cols="50">` + strCellValue + `</textarea>
                            </div>
                        </div>
			<button id="save">Save</button>
                    </div>
                `,
                },
            }
        });
        modal.show();
    }
});
