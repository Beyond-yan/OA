// Decompiled by Jad v1.5.8e2. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://kpdus.tripod.com/jad.html
// Decompiler options: packimports(3) fieldsfirst ansi space 
// Source File Name:   QueryFilter.java

package com.gdssoft.core.command;

import com.gdssoft.core.util.ParamUtil;
import com.gdssoft.core.web.paging.PagingBean;
import java.util.*;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

// Referenced classes of package com.gdssoft.core.command:
//			FieldCommandImpl, SortCommandImpl, ExampleCommandImpl

public class QueryFilter
{

	public static final String ORDER_DESC = "desc";
	public static final String ORDER_ASC = "asc";
	public static final Log logger =null;
	private HttpServletRequest request;
	private String filterName;
	private List paramValues;
	private List commands;
	private Set aliasSet;
	private PagingBean pagingBean;

	public void setPagingBean(PagingBean pagingBean) {
		this.pagingBean = pagingBean;
	}

	public String getFilterName()
	{
		return filterName;
	}

	public void setFilterName(String filterName)
	{
		this.filterName = filterName;
	}

	public PagingBean getPagingBean()
	{
		return pagingBean;
	}

	public QueryFilter(HttpServletRequest request)
	{
		this.request = null;
		filterName = null;
		paramValues = new ArrayList();
		commands = new ArrayList();
		aliasSet = new HashSet();
		pagingBean = null;
		this.request = request;
		for (Enumeration paramEnu = request.getParameterNames(); paramEnu.hasMoreElements();)
		{
			String paramName = (String)paramEnu.nextElement();
			if (paramName.startsWith("Q_"))
			{
				String paramValue = request.getParameter(paramName);
				addFilter(paramName, paramValue);
			}
		}

		Integer start = Integer.valueOf(0);
		Integer limit = PagingBean.DEFAULT_PAGE_SIZE;
		String s_start = request.getParameter("start");
		String s_limit = request.getParameter("limit");
		if (StringUtils.isNotEmpty(s_start))
			start = new Integer(s_start);
		if (StringUtils.isNotEmpty(s_limit))
			limit = new Integer(s_limit);
		String sort = request.getParameter("sort");
		String dir = request.getParameter("dir");
		if (StringUtils.isNotEmpty(sort) && StringUtils.isNotEmpty(dir))
			addSorted(sort, dir);
		pagingBean = new PagingBean(start.intValue(), limit.intValue());
	}

	public QueryFilter() {
		paramValues = new ArrayList();
		commands = new ArrayList();
		filterName = null;
		aliasSet = new HashSet();
	
		// TODO Auto-generated constructor stub
	}

	public void addFilter(String paramName, String paramValue)
	{
		String fieldInfo[] = paramName.split("[_]");
		Object value = null;
		if (fieldInfo != null && fieldInfo.length == 4)
		{
			value = ParamUtil.convertObject(fieldInfo[2], paramValue);
			if (value != null)
			{
				FieldCommandImpl fieldCommand = new FieldCommandImpl(fieldInfo[1], value, fieldInfo[3], this);
				commands.add(fieldCommand);
			}
		} else
		if (fieldInfo != null && fieldInfo.length == 3)
		{
			FieldCommandImpl fieldCommand = new FieldCommandImpl(fieldInfo[1], value, fieldInfo[2], this);
			commands.add(fieldCommand);
		} else
		{
			logger.error((new StringBuilder("Query param name [")).append(paramName).append("] is not right format.").toString());
		}
	}

	public void addParamValue(Object value)
	{
		paramValues.add(value);
	}

	public List getParamValueList()
	{
		return paramValues;
	}

	public void addSorted(String orderBy, String ascDesc)
	{
		commands.add(new SortCommandImpl(orderBy, ascDesc, this));
	}

	public void addExample(Object object)
	{
		commands.add(new ExampleCommandImpl(object));
	}

	public List getCommands()
	{
		return commands;
	}

	public Set getAliasSet()
	{
		return aliasSet;
	}

}
