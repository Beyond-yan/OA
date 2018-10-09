package com.gdssoft.oa.action.mobile;

import java.io.UnsupportedEncodingException;
import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.personal.Addressbook;
import com.gdssoft.oa.service.personal.AddressbookService;

public class AddressbookAction extends BaseAction{
	@Resource
	private AddressbookService addressbookService;
	
	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		boolean isSelect = false;
		if(getRequest().getParameter("personName") != null){
			filter.addFilter("Q_personName_S_LK", getRequest().getParameter("personName"));
			isSelect = true;
		}
		if(getRequest().getParameter("department") != null){
			filter.addFilter("Q_department_S_LK", getRequest().getParameter("department"));
			isSelect = true;
		}
		if(isSelect == true){
			//PagingBean pb = new PagingBean(0, 99999);
			List<Addressbook> list= addressbookService.getAll(filter);
			getRequest().setAttribute("abList", list);
			getRequest().setAttribute("listCount", list.size());
		}
		getDateTime();
		return "list";
	}
	
	public String get() throws UnsupportedEncodingException{
		QueryFilter filter=new QueryFilter(getRequest());		
		
		filter.addFilter("Q_personName_S_EQ", java.net.URLDecoder.decode(getRequest().getParameter("personName"),"UTF-8"));
		filter.addFilter("Q_department_S_EQ", java.net.URLDecoder.decode(getRequest().getParameter("department"),"UTF-8"));
		filter.addFilter("Q_source_S_EQ", java.net.URLDecoder.decode(getRequest().getParameter("source"),"UTF-8"));
		List<Addressbook> list= addressbookService.getAll(filter);	
		Addressbook addressbook = list.get(0);
		getRequest().setAttribute("addressbook", addressbook);
		getDateTime();
		return "detail";
	}
	
	private void getDateTime(){
		java.util.Date date = new java.util.Date();
		java.text.SimpleDateFormat format = new java.text.SimpleDateFormat("yyyy年MM月dd日 hh:mm", java.util.Locale.CHINA);		
		footDateTime = format.format(date);
	}
	private String footDateTime;	
	
	public String getFootDateTime() {
		return footDateTime;
	}
	public void setFootDateTime(String footDateTime) {
		this.footDateTime = footDateTime;
	}
}
