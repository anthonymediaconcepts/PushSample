/**
 * Created with IntelliJ IDEA.
 * User: John Bowen
 * Date: 8/13/12
 * Time: 6:08 PM
 * To change this template use File | Settings | File Templates.
 */


function appendWithTransformationHTMLCode(TemplateElementName, codeToInject, data, transformationClass, groupBy, groupOpenTag, groupCloseTag, filterClass, filterByColumnName, isBySortOrder)
    { 
    var cloneNode = document.getElementById(TemplateElementName);
    var numberOfRows = data.getNumberOfRows();
    var parentNode = document.getElementById(TemplateElementName);
	var tmpGroupOpenTag = "";
	var htmlString = "";
	var thisGroup = "";
				
    // Remove all children
    while (parentNode.hasChildNodes())
        parentNode.removeChild(parentNode.lastChild);
		
		if(groupBy!=undefined) {
				
			for (rownum = 0; rownum < numberOfRows; rownum++) {
				
				if(isBySortOrder) {
				
					if(getRowColGroupName(rownum, data, filterByColumnName) < filterClass) {
						var getThisGroup = getRowColGroupName (rownum, data, groupBy);
						var getNextGroup = getRowColGroupName ((rownum+1), data, groupBy);
						
						newGroupOpenTag = groupOpenTag;
						transformationClass.text = newGroupOpenTag;
						transformationClass.row = (rownum);
						newGroupOpenTag = transformationClass.convert();
						
						
						if(thisGroup != getThisGroup) {
							htmlString += newGroupOpenTag;
						} else {
							htmlString += "";
						}
						
						htmlString += findAndReplaceTableData(codeToInject, data, rownum, transformationClass);
						thisGroup = getThisGroup;
						
						if(getNextGroup != getThisGroup) {
							if(getNextGroup != filterClass)
								htmlString += groupCloseTag;
						} else {
							htmlString += "";
						}	
					} else {	
						htmlString += "";
					}
				} else if(filterClass==undefined && filterByColumnName==undefined && !isBySortOrder) {
					
					var getThisGroup = getRowColGroupName (rownum, data, groupBy);
					var getNextGroup = getRowColGroupName ((rownum+1), data, groupBy);
						
					if(thisGroup != getThisGroup) {
						newGroupOpenTag = replaceValuesFromData(tmpGroupOpenTag, data, rownum);
						htmlString += newGroupOpenTag;
					} else {
						htmlString += "";
					}
					
					htmlString += findAndReplaceTableData(codeToInject, data, rownum, transformationClass);
					thisGroup = getThisGroup;
					if(getNextGroup != getThisGroup) {
						htmlString += groupCloseTag;
					} else {
						htmlString += "";
					}
						
				} else {
					
					if(getRowColGroupName(rownum, data, filterByColumnName) != filterClass) {
						
						var getThisGroup = getRowColGroupName (rownum, data, groupBy);
						var getNextGroup = getRowColGroupName ((rownum+1), data, groupBy);
						
						newGroupOpenTag = groupOpenTag;
						transformationClass.text = newGroupOpenTag;
						transformationClass.row = (rownum);
						newGroupOpenTag = transformationClass.convert();
						
						
						if(thisGroup != getThisGroup) {
							htmlString += newGroupOpenTag;
						} else {
							htmlString += "";
						}
						
						htmlString += findAndReplaceTableData(codeToInject, data, rownum, transformationClass);
						thisGroup = getThisGroup;
						
						if(getNextGroup != getThisGroup) {
							if(getNextGroup != filterClass)
								htmlString += groupCloseTag;
						} else {
							htmlString += "";
						}	
					} else {	
						htmlString += "";
					}
				} //end else 
				
			}//end for		
			
			
			
			$('#' + TemplateElementName).append(htmlString);
			
		} else {
			
			for (rownum = 0; rownum < numberOfRows; rownum++) {
				if(isBySortOrder) {	
					if(getRowColGroupName(rownum, data, filterByColumnName) < filterClass) {	
						htmlString += findAndReplaceTableData(codeToInject, data, rownum, transformationClass);
					}
					
				} else if(filterClass==undefined && filterByColumnName==undefined && !isBySortOrder) {
					htmlString += findAndReplaceTableData(codeToInject, data, rownum, transformationClass, filterClass);
				} else {
					
					if(getRowColGroupName(rownum, data, filterByColumnName) != filterClass) {
						//console.log( getRowColGroupName(rownum, data, 'RoomName') + ":"+  getRowColGroupName(rownum, data, 'IsPackage') ); 
						htmlString += findAndReplaceTableData(codeToInject, data, rownum, transformationClass, filterClass);
					}
						
				}
			} //end for
			
			$('#' + TemplateElementName).append(htmlString);
		} //end else
    }

function getRowColGroupName (row, data, colnameOrIndex) {
	try {
		if(isNaN(colnameOrIndex))
			var thisColText = data.getValue(row, data.getColumnIndex(colnameOrIndex));
		else 
			var thisColText = data.getValue(row, colnameOrIndex);
		
		return(thisColText);
	} catch(e) {}
}

function findAndReplaceTableData(codeToInject, data, rownum, transformationClass, filterClass, first)
    {
    var htmlData = codeToInject;
    htmlData = replaceValuesFromData(htmlData, data, rownum, filterClass);

    if (transformationClass != null)
        {
        transformationClass.data = data;
        transformationClass.row = rownum;
        transformationClass.text = htmlData;
        htmlData = transformationClass.convert();
        }
    return(htmlData);
    }

function replaceValuesFromData(text, data, row, filter)
    {
		colls = data.getNumberOfColumns();
		for (colnum = 0; colnum < colls; colnum++)
			{
			var key = data.getColumnLabel(colnum);
				//if(group == key)
				
			var value = data.getValue(row, colnum);
			var regex = new RegExp('%' + key + '%', "g");
			text = text.replace(regex, value);
			}
		
		if(filter!=undefined) {
			if (text.toLowerCase().indexOf(filter) >= 0) {
				text = "";
			}
			else {
				text = text.replace(/%Row%/g, row);
			}
			
				return(text);
		} else {
			text = text.replace(/%Row%/g, row);
			return(text);
		}	
    }


function getColumnIDFromColumnName(data, columnName)
    {
    colls = data.getNumberOfColumns();
    for (colnum = 0; colnum < colls; colnum++)
        {
        var key = data.getColumnLabel(colnum);
        if (key == columnName)
            return(colnum)
        }
    return(-1);
    }

function getRowData(data, row, label)
    {
    var value = "";
    try
        {
        value = data.getValue(row, getColumnIDFromColumnName(data, label));

        }
    catch (e)
        {
        value = "";
        }
    return(value);
    }


var jasmineDataFilter = {
    // The following should not be renamed and will be filled in automatically
    columnName:new Array(),
    FilterValue:new Array(),

    addFilter:function (_columnName, _Value)
        {
        try
            {
            this.columnName.push(_columnName);
            this.FilterValue.push(_Value);
            }
        catch (e)
            {
            return("");
            }
        return(this.text);
        },

    clearFilter:function ()
        {
        this.columnName = new Array();
        this.FilterValue = new Array();
        },

    filterContains:function (data)
        {
        try
            {
            for (i = 0; i < this.columnName.length; i++)
                {
                // get the column offset
                var columnOffset = getColumnIDFromColumnName(data, this.columnName[i]);
                var numberOfRows = data.getNumberOfRows();
                for (var row = numberOfRows; row--;)
                    {
                    value = data.getValue(row, columnOffset);
                    if (value.toString().indexOf(this.FilterValue[i]) == -1)
                        data.removeRow(row);
                    }
                }
            }
        catch (e)
            {
            return(null);
            }
        return(data);
        },

    filterExactMatch:function (data)
        {
        try
            {
            for (i = 0; i < this.columnName.length; i++)
                {
                // get the column offset
                var columnOffset = getColumnIDFromColumnName(data, this.columnName[i]);
                var numberOfRows = data.getNumberOfRows();
                for (var row = numberOfRows; row--;)
                    {
                    value = data.getValue(row, columnOffset);
                    if (value != this.FilterValue[i])
                        data.removeRow(row);
                    }
                }
            }
        catch (e)
            {
            return(null);
            }
        return(data);
        },
    /**
     *  Return only the rows asked for as a data table
     * @param data - The data table
     * @param fromRow - The row from where teh data should start 0=first row
     * @param count - The maximum number of rows to return
     */
    getPagedDataTable:function (data, fromRow, count)
        {

        try
            {
            var numberOfRows = data.getNumberOfRows();
            var endRow = fromRow + count;

            if (fromRow > numberOfRows)
                return(new google.visualization.DataTable());

            var view = new google.visualization.DataView(data);

            if (fromRow > 0)
                view.hideRows(0, (fromRow - 1));

            if (endRow < numberOfRows)
                view.hideRows((endRow), numberOfRows);

            return(view.toDataTable());
            }
        catch (e)
            {
            return(new google.visualization.DataTable());
            }
        }

}

/***************************************************************
 * Error Class for Extracting errors and messages from the DataTable
 * @param dataTable
 * @constructor
 */

function DataTableMessageViewer(dataTable)
    {
    this.dataTable = dataTable
    }

DataTableMessageViewer.prototype.getErrorCode = function ()
    {
    return(this.dataTable.getTableProperty("ErrorCode"));
    };

DataTableMessageViewer.prototype.getErrorDetail = function ()
    {
    return(this.dataTable.getTableProperty("ErrorDetail"));
    };

DataTableMessageViewer.prototype.getMessageCode = function ()
    {
    return(this.dataTable.getTableProperty("MessageCode"));
    };

DataTableMessageViewer.prototype.getMessageDetail = function ()
    {
    return(this.dataTable.getTableProperty("MessageDetail"));
    };
	
DataTableMessageViewer.prototype.getAdditionalInfoCode = function ()
    {
    return(this.dataTable.getTableProperty("AdditionalInfoCode"));
    };

DataTableMessageViewer.prototype.getAdditionalInfoDetail = function ()
    {
    return(this.dataTable.getTableProperty("AdditionalInfoDetail"));
    };	

DataTableMessageViewer.prototype.hasError = function ()
    {
    if (this.dataTable.getTableProperty("ErrorCode"))
        return(true);
    else
        return(false);
    }

DataTableMessageViewer.prototype.hasMessage = function ()
    {
    if (this.dataTable.getTableProperty("MessageCode"))
        return(true);
    else
        return(false);
    };
	
DataTableMessageViewer.prototype.hasMessage = function ()
    {
    if (this.dataTable.getTableProperty("AdditionalInfoCode"))
        return(true);
    else
        return(false);
    };


