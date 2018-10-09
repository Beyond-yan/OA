package com.gdssoft.oa.action.system;
/*
 *  广州宏天软件有限公司 J.Office协同办公管理系统   -- http://www.jee-soft.cn
 *  Copyright (C) 2008-2010 GuangZhou HongTian Software Limited Company.
*/
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppTeam;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.service.system.AppTeamService;
import com.gdssoft.oa.service.system.AppUserService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class AppTeamAction extends BaseAction{
	@Resource
	private AppTeamService appTeamService;
	private AppTeam appTeam;
	@Resource
	private AppUserService appUserService;
	private Long teamId;

	public Long getTeamId() {
		return teamId;
	}

	public void setTeamId(Long teamId) {
		this.teamId = teamId;
	}

	public AppTeam getAppTeam() {
		return appTeam;
	}

	public void setAppTeam(AppTeam appTeam) {
		this.appTeam = appTeam;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		AppUser currentUser = ContextUtil.getCurrentUser();
		QueryFilter filter=new QueryFilter(getRequest());
		filter.addFilter("Q_appUser.userId_L_EQ", currentUser.getUserId().toString());
		List<AppTeam> list= appTeamService.getAll(filter);
		
//		Type type=new TypeToken<List<AppTeam>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
	/*	Gson gson=new Gson();
		buff.append(gson.toJson(list, type));
		buff.append("}");*/
		
		
		JSONSerializer serializer=new JSONSerializer();
        serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm"),
        "createTime");
//        serializer.transform(new DateTransformer("hh:mm"),
//        "offDutyTime");
        buff.append(serializer.exclude(new String[] {"class"}).serialize(list));
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	
	/**
	 * 列出组别树
	 * 
	 */
	public String tree(){
		AppUser currentUser = ContextUtil.getCurrentUser();
		QueryFilter filter=new QueryFilter(getRequest());
		filter.addFilter("Q_appUser.userId_L_EQ", currentUser.getUserId().toString());
		
		List<AppTeam>  listTeam;
		StringBuffer buff = new StringBuffer("[");
		listTeam=appTeamService.getAll(filter);
		for(AppTeam team:listTeam){
			buff.append("{id:'"+team.getTeamId()+"',text:'"+team.getTeamName()+"',leaf:true},");
		}
		if (!listTeam.isEmpty()) {
			buff.deleteCharAt(buff.length() - 1);
	    }
		buff.append("]");
		setJsonString(buff.toString());
		return SUCCESS;
	}
	
	public String treeSelDef(){
		AppUser currentUser = ContextUtil.getCurrentUser();
		QueryFilter filter=new QueryFilter(getRequest());
		filter.addFilter("Q_appUser.userId_L_EQ", currentUser.getUserId().toString());
		List<AppTeam> listParent= appTeamService.getAll(filter);
		StringBuffer buff = new StringBuffer();
		
		buff.append("[");
		for(AppTeam at:listParent){
			buff.append("{id:'"+at.getTeamId()+"',text:'"+at.getTeamName()+"',");
		    buff.append(findChild(at.getMembers()));
		}
		if (!listParent.isEmpty()) {
			buff.deleteCharAt(buff.length() - 1);
	    }
		
		buff.append("]");
		setJsonString(buff.toString());
		return SUCCESS;
	}
	
	public String findChild(Set<AppUser> apSet){
		StringBuffer buff1=new StringBuffer("");
		List<AppUser> list=new ArrayList<AppUser>(apSet);
		if(list.size()==0){
			buff1.append("leaf:true},");
			return buff1.toString(); 
		}else {
			buff1.append("expanded:true,children:[");
			for(AppUser dep2:list){				
				buff1.append("{id:'"+dep2.getUserId()+"',text:'"+dep2.getUsername()+"',");
				buff1.append("leaf:true},");
			}
			buff1.deleteCharAt(buff1.length() - 1);
			buff1.append("]},");
			return buff1.toString();
		}
	}
	/**
	 * 批量删除
	 * @return
	 */
	public String multiDel(){
		
		String[]ids=getRequest().getParameterValues("ids");
		if(ids!=null){
			for(String id:ids){
				appTeamService.remove(new Long(id));
			}
		}
		
		jsonString="{success:true}";
		
		return SUCCESS;
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String get(){
		AppTeam appTeam=appTeamService.get(teamId);
		
		StringBuffer sb = new StringBuffer("{success:true,data:");
		
		JSONSerializer serializer=new JSONSerializer();
        serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm"),
        "createTime");
        sb.append(serializer.exclude(new String[] {"class"}).serialize(appTeam));
        sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		if(appTeam.getTeamId()==null){
			AppUser currentUser = ContextUtil.getCurrentUser();
			appTeam.setCreatorId(currentUser.getUserId());
			appTeam.setCreateTime(new Date());
			appTeamService.save(appTeam);
		}else{
			AppTeam orgAppTeam=appTeamService.get(appTeam.getTeamId());
			try{
				if(appTeam.getMembers()==null||appTeam.getMembers().size()==0){
					appTeam.setMembers(orgAppTeam.getMembers());
				}
				BeanUtil.copyNotNullProperties(orgAppTeam, appTeam);
				appTeamService.save(orgAppTeam);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
	
	/**
	 * 获取群组成员
	 * @return
	 */
	public String listMembers(){
		String teamId=getRequest().getParameter("teamId");
		String start=getRequest().getParameter("start");
		String limit=getRequest().getParameter("limit");
		List<AppUser> list=appTeamService.getMembers(teamId,start,limit);
		List<AppUser> listSize=appTeamService.getMembers(teamId,"0","9999");
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(listSize.size()).append(",result:");
		
	/*	Gson gson=new Gson();
		buff.append(gson.toJson(list, type));
		buff.append("}");*/
		
		
		JSONSerializer serializer=new JSONSerializer();
    /*    serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm"),
        "createTime");*/
//        serializer.transform(new DateTransformer("hh:mm"),
//        "offDutyTime");
        buff.append(serializer.exclude(new String[] {"class"}).serialize(list));
		buff.append("}");
		
		jsonString=buff.toString();
		return SUCCESS;
	}
	
	/**
	 * 添加群组成员
	 */
	public String addMembers(){
		String teamId=getRequest().getParameter("teamId");
		String ids=getRequest().getParameter("ids");
		if(null != ids && "" != ids){
			AppTeam appTeam=appTeamService.get(new Long(teamId));
			java.util.Set<AppUser> members =appTeam.getMembers();
			String[] idsArray = ids.split(",");
			for (int i = 0; i < idsArray.length; i++) {
				AppUser appUser = new AppUser();
				appUser = appUserService.get(new Long(idsArray[i]));
				members.add(appUser);
			}
			appTeam.setMembers(members);
			appTeamService.save(appTeam);
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}
	
	
	/**
	 * 删除群组成员
	 */
	public String multiDelMembers(){
		String teamId=getRequest().getParameter("teamId");
		String[]ids=getRequest().getParameterValues("ids");
		AppTeam appTeam=appTeamService.get(new Long(teamId));
		java.util.Set<AppUser> members =appTeam.getMembers();
//		String[] idsArray = ids.split(",");
		for (int i = 0; i < ids.length; i++) {
			AppUser appUser = new AppUser();
			appUser = appUserService.get(new Long(ids[i]));
			members.remove(appUser);
		}
		appTeam.setMembers(members);
		appTeamService.save(appTeam);
		setJsonString("{success:true}");
		return SUCCESS;
	}
	
	public String listName(){
		QueryFilter filter=new QueryFilter(getRequest());
		StringBuffer sb=new StringBuffer();
		AppUser currentUser = ContextUtil.getCurrentUser();
		filter.addFilter("Q_appUser.userId_L_EQ", currentUser.getUserId().toString());
		List<AppTeam> appTeamList=appTeamService.getAll(filter);
		sb.append("[");
		for(AppTeam appTeam:appTeamList){
			sb.append("['").append(appTeam.getTeamId()).append("','").append(appTeam.getTeamName()).append("'],");
		}
		if(appTeamList.size()>0){
			sb.deleteCharAt(sb.length()-1);
		}
		sb.append("]");
		setJsonString(sb.toString());
		return SUCCESS;
	}
	
	/**
	 * 显示单个工作组
	 * @return
	 */
	public String select(){
		String teamId=getRequest().getParameter("teamId");
		AppTeam appTeam=appTeamService.get(new Long(teamId));
		StringBuffer sb = new StringBuffer("{success:true,'totalCounts':").append("1").append(",result:[{");
        sb.append("\"depId\":").append(appTeam.getTeamId()).append(",\"depName\":\"").append(appTeam.getTeamName()).append("\",\"depLevel\":2}]");
        sb.append("}");
		setJsonString(sb.toString());
		return SUCCESS;
	}
	
}
