package com.gdssoft.oa.action.flow;

import java.util.List;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.flow.ProcessReport;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.flow.ProcessReportService;
import com.gdssoft.oa.service.system.DepartmentService;
import com.gdssoft.oa.service.system.SysConfigService;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;

public class ProcessReportAction extends BaseAction {
	@Resource
	ProcessReportService processReportService;
	@Resource
	SysConfigService sysConfigService;
	@Resource
	DepartmentService departmentService;
	
	ProcessReport processPort;

	private String assignee;
	private long runid;
	public String getAssignee() {
		return assignee;
	}
	public void setAssignee(String assignee) {
		this.assignee = assignee;
	}
	public long getRunid() {
		return runid;
	}
	public void setRunid(long runid) {
		this.runid = runid;
	}
	public ProcessReport getProcessPort() {
		return processPort;
	}
	public void setProcessPort(ProcessReport processPort) {
		this.processPort = processPort;
	}
	
	
	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		AppUser appUser = ContextUtil.getCurrentUser();
		
		Set<AppRole> roles = appUser.getRoles();
		boolean isAdmin = false;
		for(AppRole role:roles)
		{
			if (role.getRoleId() == -1L)//管理员权限
			{
				isAdmin = true;
				continue;
			}
		
		}
				
		if ((!isAdmin))//非管理员需要过滤		
		{

		}
		
		List<ProcessReport> list= processReportService.getAll(filter);
		System.out.println("----List<ProcessReport> list size:"+list.size());
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
		JSONSerializer serializer=new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss "), "createtime");
		buff.append(serializer.exclude(new String[] { "class" }).serialize(list));		

		buff.append("}");
		System.out.println("----buff.toString:" + buff.toString());
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	
	
	public String listall(){
		QueryFilter filter=new QueryFilter(getRequest());

		AppUser appUser = ContextUtil.getCurrentUser();
		if(getRequest().getParameter("Q_type_S_EQ") != null
				&& (!("").equals(getRequest().getParameter("Q_type_S_EQ")))){
			getRequest().setAttribute("Q_typeid", appUser.getUserId());
		}
		//thelist是绑定分页数据；list是全部数据
		List<ProcessReport> list = null;
		List<ProcessReport> thelist = null;
		
		HttpSession hs = getRequest().getSession();
		
		if(hs.getAttribute("flag") != null){					//判断hs session中已经存在查询必要条件是否
			/*String change=getRequest().getParameter("isChange")==null?"empty":getRequest().getParameter("isChange");//当传入参数isChange值为isChange说明需要重新查询数据		
			if((checkSessionParams(getRequest()))&&(!"isChange".equals(change))){				//判断查询条件是否有变化
				list = (List<ProcessReport>)hs.getAttribute("list");
			}else{*/
				list = processReportService.getbyauth(getRequest(),filter,appUser);
				/*hs.setAttribute("list",list);
				sessionParams(getRequest());					//保存参数
			}*/
		}else{
			list = processReportService.getbyauth(getRequest(),filter,appUser);
			
			hs.setAttribute("list",list);
			sessionParams(getRequest());						//保存参数
		}
		
		int start = Integer.parseInt(getRequest().getParameter("start")==null?"0":getRequest().getParameter("start"));
		int limit = Integer.parseInt(getRequest().getParameter("limit")==null?"25":getRequest().getParameter("limit"));
		
		if(start+limit>list.size()){
			thelist = list.subList(start, list.size());
		}else{
			thelist = list.subList(start, start+limit);
		}
		
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(list.size()).append(",result:");
		
		JSONSerializer serializer=new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"), "createtime");
		buff.append(serializer.exclude(new String[] { "class" }).serialize(thelist));

		buff.append("}");
		
		jsonString=buff.toString();
		
		
		return SUCCESS;
	}
	
	/**
	 *记录本次查询除分页所需之外的参数.
	 *将req中的必要参数保存到hs a httpSession，null时保存"empty".
	 *@param req javax.servlet.http.HttpServletRequest以获取参数
	 *@author F3229233
	 */
	private void sessionParams(HttpServletRequest req){
		HttpSession hs = getRequest().getSession();
		
		hs.setAttribute("Q_type_S_EQ",req.getParameter("Q_type_S_EQ")==null?
				"empty":req.getParameter("Q_type_S_EQ"));
		hs.setAttribute("Q_creator_S_LK",req.getParameter("Q_creator_S_LK")==null?
				"empty":req.getParameter("Q_creator_S_LK"));
//		hs.setAttribute("Q_issueDep_S_EQ",req.getParameter("Q_issueDep_S_EQ")==null?
//				"empty":req.getParameter("Q_issueDep_S_EQ")); 
		hs.setAttribute("Q_issueDep_S_LK",req.getParameter("Q_issueDep_S_LK")==null?
				"empty":req.getParameter("Q_issueDep_S_LK"));
		hs.setAttribute("proTypeId",req.getParameter("proTypeId")==null?
				"empty":req.getParameter("proTypeId"));
		hs.setAttribute("Q_createtime_D_GT",req.getParameter("Q_createtime_D_GT")==null?
				"empty":req.getParameter("Q_createtime_D_GT"));
		hs.setAttribute("Q_createtime_D_LT",req.getParameter("Q_createtime_D_LT")==null?
				"empty":req.getParameter("Q_createtime_D_LT"));
		hs.setAttribute("Q_subject_S_EQ",req.getParameter("Q_subject_S_EQ")==null?
				"empty":req.getParameter("Q_subject_S_EQ"));
		
		hs.setAttribute("flag","true");	//标注必要查询条件cache成功
	}
	
	/**
	 * 判断查询参数是否有变化
	 * @param req
	 * @return 如果req中的相应参数和hs中的每个 都 相等返回true
	 * @author F3229233 
	 * @editor xt
	 */
	private boolean checkSessionParams(HttpServletRequest req){
		HttpSession hs = getRequest().getSession();
		boolean flag = true;
		
		if(!((String)hs.getAttribute("Q_type_S_EQ"))
				.equals((req.getParameter("Q_type_S_EQ"))==null?"empty":req.getParameter("Q_type_S_EQ"))){
			flag = false;
		}
		if(!((String)hs.getAttribute("Q_creator_S_LK"))
				.equals((req.getParameter("Q_creator_S_LK"))==null?"empty":req.getParameter("Q_creator_S_LK"))){
			flag = false;
		}
//		if(!((String)hs.getAttribute("Q_issueDep_S_EQ"))
//				.equals((req.getParameter("Q_issueDep_S_EQ"))==null?"empty":req.getParameter("Q_issueDep_S_EQ"))){
//			flag = false;
//		}
//20121011 xt edit	
		if(!((String)hs.getAttribute("Q_issueDep_S_LK"))
				.equals((req.getParameter("Q_issueDep_S_LK"))==null?"empty":req.getParameter("Q_issueDep_S_LK"))){
			flag = false;			
		}		
		if(!((String)hs.getAttribute("proTypeId"))
				.equals((req.getParameter("proTypeId"))==null?"empty":req.getParameter("proTypeId"))){
			flag = false;
		}
		if(!((String)hs.getAttribute("Q_createtime_D_GT"))
				.equals((req.getParameter("Q_createtime_D_GT")==null?"empty":req.getParameter("Q_createtime_D_GT")))){
			flag = false;
		}
		if(!((String)hs.getAttribute("Q_createtime_D_LT"))
				.equals((req.getParameter("Q_createtime_D_LT"))==null?"empty":req.getParameter("Q_createtime_D_LT"))){
			flag = false;
		}
		if(!((String)hs.getAttribute("Q_subject_S_EQ"))
				.equals((req.getParameter("Q_subject_S_EQ"))==null?"empty":req.getParameter("Q_subject_S_EQ"))){
			flag = false;
		}
		return flag;
	}
}
