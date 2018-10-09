package com.gdssoft.oa.action.work;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.oa.model.system.SysConfig;
import com.gdssoft.oa.model.work.WorkContent;
import com.gdssoft.oa.model.work.WorkContentProcess;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.FileAttachService;
import com.gdssoft.oa.service.system.SysConfigService;
import com.gdssoft.oa.service.work.WorkContentProcessService;
import com.gdssoft.oa.service.work.WorkContentService;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;

public class WorkContentAction extends BaseAction{
	@Resource
	private SysConfigService sysConfigService;
	@Resource
	private WorkContentService workContentService;
	@Resource
	private AppUserService appUserService;
	@Resource
	private WorkContentProcessService workContentProcessService;
	@Resource
	private FileAttachService fileAttachService;
	
	private WorkContent workContent;
	private WorkContentProcess workContentProcess;
	
	public WorkContent getWorkContent() {
		return workContent;
	}
	public void setWorkContent(WorkContent workContent) {
		this.workContent = workContent;
	}
	public WorkContentProcess getWorkContentProcess() {
		return workContentProcess;
	}
	public void setWorkContentProcess(WorkContentProcess workContentProcess) {
		this.workContentProcess = workContentProcess;
	}
	public String list() {
		String s=getRequest().getParameter("Q_status_N_EQ");
		QueryFilter filter = new QueryFilter(getRequest());
		SysConfig isArchivesManagerID=sysConfigService.findByKey("archivesManagerID");
		SysConfig diaryLeaderRoleId=sysConfigService.findByKey("diaryLeaderRoleId");
		SysConfig leaderRoleId=sysConfigService.findByKey("leaderRoleId");
		boolean flag=false;
		AppUser appUser = ContextUtil.getCurrentUser();
		Set<AppRole> roles = appUser.getRoles();
		for (AppRole role : roles) {
			if (role.getRoleId() == -1L)
			{
				flag = true;
				break;
			}
			if (null != isArchivesManagerID
					&& role.getRoleId().toString()
							.equals(isArchivesManagerID.getDataValue())) {
				flag = true;
				break;
			}
			if (null != diaryLeaderRoleId
					&& role.getRoleId().toString()
							.equals(diaryLeaderRoleId.getDataValue())) {
				flag = true;
				break;
			}
			if (null != leaderRoleId
					&& role.getRoleId().toString()
							.equals(leaderRoleId.getDataValue())) {
				flag = true;
				break;
			}
		}
		String processStatus=getRequest().getParameter("processStatus");
		if(!flag){//没得权限
			if(processStatus!=null&&"0".equals(processStatus)){//可以办理
				filter.addFilter("Q_userid_S_LK", appUser.getUserId().toString());
			}else if(processStatus!=null&&"1".equals(processStatus)){
				filter.addFilter("Q_userid_S_NLK", appUser.getUserId().toString());
			}
		}
		filter.addSorted("orderid", "desc");
		filter.addSorted("createtime", "desc");
		List<WorkContent> list = workContentService.getAll(filter);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd"), "createtime");
		serializer.transform(new DateTransformer("yyyy-MM-dd"), "limitdate");
		buff.append(serializer.exclude(new String[] { "class" })
				.serialize(list));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}

	public String getById() {
		String id = getRequest().getParameter("id");
		WorkContent workContent = workContentService.get(new Long(id));
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd"), "createtime");
		serializer.transform(new DateTransformer("yyyy-MM-dd"), "limitdate");
		sb.append(serializer.exclude(new String[] { "class" })
				.serialize(workContent));
		sb.append("}");
		setJsonString(sb.toString());
		return SUCCESS;
	}
	public String updateUser() {
		Long id = workContent.getId();
		String username = getRequest().getParameter("workContentUserName");
		String userid = getRequest().getParameter("workContentUserId");
		String username1=workContent.getUsername();
		String userid1=workContent.getUserid();
		String username2="";
		String userid2="";
		if(userid!=null&&!"".equals(userid)&&!"null".equals(userid)){
			String[] usernames=username.split(",");
			String[] userids=userid.split(",");
			AppUser appUser = ContextUtil.getCurrentUser();
			Long depId=appUser.getDepartment().getDepId();
			for(int i=0;i<userids.length;i++){
				appUser=appUserService.get(new Long(userids[i]));
				if(appUser.getDepartment().getDepId().intValue()!=depId.intValue()){
					username2+=usernames[i]+",";
					userid2+=userids[i]+",";
				}
			}
		}
		if(userid1!=null&&!"".equals(userid1)&&!"null".equals(userid1)){
			userid2+=userid1;
			username2+=username1;
		}
		WorkContent workContent = workContentService.get(new Long(id));
		workContent.setUsername(username2);
		workContent.setUserid(userid2);
		workContentService.save(workContent);
		return SUCCESS;
	}
	public String save() {
		AppUser appUser = ContextUtil.getCurrentUser();
		Long id=workContent.getId();
		workContent.setCreateuser(appUser.getUserId());
		workContent.setCreatetime(new Date(System.currentTimeMillis()));
		workContent.setStatus(new Integer(0));
		String refileId = getRequest().getParameter("fileIds");
		if (StringUtils.isNotEmpty(refileId)) {
			Set workFiles = new HashSet();
			String[] files = refileId.split(",");
			if (files.length > 0) {
				for (int i = 0; i < files.length; i++) {
					FileAttach fa = fileAttachService.get(Long.valueOf(files[i]));
					workFiles.add(fa);
				}
			}
			workContent.setWorkFiles(workFiles);
		}
		workContentService.save(workContent);
		//首次登记添加事项登记记录
		if(id==null){
			WorkContentProcess wcp=new WorkContentProcess();
			wcp.setWorkContentId(workContent.getId());
			wcp.setContent("事项登记");
			wcp.setCreatetime(new Date(System.currentTimeMillis()));
			wcp.setCreateuser(appUser.getFullname());
			workContentProcessService.save(wcp);
		}
		return SUCCESS;
	}

	public String saveProcess() {
		AppUser appUser = ContextUtil.getCurrentUser();
		workContentProcess.setCreateuser(appUser.getFullname());
		workContentProcess.setCreatetime(new Date(System.currentTimeMillis()));
		String refileId = getRequest().getParameter("fileIds");
		if (StringUtils.isNotEmpty(refileId)) {
			Set processFiles = new HashSet();
			String[] files = refileId.split(",");
			if (files.length > 0) {
				for (int i = 0; i < files.length; i++) {
					FileAttach fa = fileAttachService.get(Long.valueOf(files[i]));
					processFiles.add(fa);
				}
			}
			workContentProcess.setProcessFiles(processFiles);
		}
		workContentProcessService.save(workContentProcess);
		return SUCCESS;
	}
	public String saveProcessEnd() {
		AppUser appUser = ContextUtil.getCurrentUser();
		workContentProcess.setCreateuser(appUser.getFullname());
		workContentProcess.setCreatetime(new Date(System.currentTimeMillis()));
		workContentProcessService.save(workContentProcess);
		Long id=workContentProcess.getWorkContentId();
		WorkContent workContent=workContentService.get(id);
		workContent.setStatus(new Integer(1));
		workContentService.save(workContent);
		return SUCCESS;
	}
	public String del() {
		String[] ids = getRequest().getParameterValues("ids");
		if (ids != null) {
			for (String id : ids) {
				workContentService.remove(new Long(id));
			}
		}
		jsonString = "{success:true}";
		return SUCCESS;
	}
	
	public String display(){
    	//初始化分页数据
		QueryFilter filter = new QueryFilter(getRequest());
		SysConfig isArchivesManagerID=sysConfigService.findByKey("archivesManagerID");
		SysConfig diaryLeaderRoleId=sysConfigService.findByKey("diaryLeaderRoleId");
		SysConfig leaderRoleId=sysConfigService.findByKey("leaderRoleId");
		boolean flag=false;
		AppUser appUser = ContextUtil.getCurrentUser();
		Set<AppRole> roles = appUser.getRoles();
		for (AppRole role : roles) {
			if (role.getRoleId() == -1L)
			{
				flag = true;
				break;
			}
			if (null != isArchivesManagerID
					&& role.getRoleId().toString()
							.equals(isArchivesManagerID.getDataValue())) {
				flag = true;
				break;
			}
			if (null != diaryLeaderRoleId
					&& role.getRoleId().toString()
							.equals(diaryLeaderRoleId.getDataValue())) {
				flag = true;
				break;
			}
			if (null != leaderRoleId
					&& role.getRoleId().toString()
							.equals(leaderRoleId.getDataValue())) {
				flag = true;
				break;
			}
		}
		if(!flag){
			filter.addFilter("Q_userid_S_LK", appUser.getUserId().toString());
		}
		filter.addSorted("orderid", "desc");
		filter.addSorted("createtime", "desc");
		List<WorkContent> list = workContentService.getAll(filter);
		List<WorkContent> returnList=new ArrayList<WorkContent>();
		for(int i=0;i<8&&i<list.size();i++){
			returnList.add(list.get(i));
		}
		//把查询结果封装到request范围内
        getRequest().setAttribute("viewList", returnList);
        //根据display 去Struts.xml文件中找对对应的jsp文件
		return "display";
	}
}
