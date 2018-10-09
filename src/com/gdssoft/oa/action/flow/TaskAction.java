package com.gdssoft.oa.action.flow;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
*/

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.jbpm.api.TaskService;
import org.jbpm.api.task.Task;


import com.gdssoft.oa.model.flow.TaskAgent;
import com.gdssoft.oa.model.info.ShortMessage;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.UserAgent;
import com.gdssoft.oa.service.flow.TaskAgentService;
import com.gdssoft.oa.service.info.ShortMessageService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.UserAgentService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import com.gdssoft.core.Constants;
import com.gdssoft.core.jbpm.pv.TaskInfo;
import com.gdssoft.core.util.ContextUtil;

import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.core.web.paging.PagingBean;

/**
 * 流程中的任务的显示及操作
 * @author csx
 *
 */
public class TaskAction extends BaseAction{
	@Resource(name="flowTaskService")
	private com.gdssoft.oa.service.flow.TaskService flowTaskService;
	@Resource
	private TaskService taskService;
	@Resource
	private ShortMessageService shortMessageService;
	@Resource
	private UserAgentService userAgentService;
	@Resource
	private TaskAgentService taskAgentService;
	@Resource
	private AppUserService appUserService;
	/**
	 * 代办事项查询方法
	 */
	public String list(){
		//是否按创建时间排序
		String createDateSort = getRequest().getParameter("createDateSort");
		//是否按紧急程度排序
		String urgentDateSort = getRequest().getParameter("urgentSort");
		//初始化分页数据
		PagingBean pb=new PagingBean(this.start, limit);
		
		//获取代办任务列表
		List<TaskInfo> tasks=flowTaskService.getTasksByUserIdFromView(ContextUtil.getCurrentUserId().toString(),pb,createDateSort,urgentDateSort);
		
		//封装json数据
		StringBuffer buff = new StringBuffer("{success:true,totalCounts:")
		.append(pb.getTotalItems()).append(",result:");
		Gson gson=new GsonBuilder().setDateFormat(Constants.DATE_FORMAT_FULL).create();
		buff.append(gson.toJson(tasks));
		
		buff.append("}");
		
		setJsonString(buff.toString());
		return SUCCESS;
	}
	/**
	 * 流程任务代办
	 * @author F3222507
	 * @return
	 */
	public String change(){
		HttpServletRequest request=getRequest();
		String taskId=request.getParameter("taskId");
		//获取代办人ID
		String userId=request.getParameter("userId");
		//获取当前用户ID
		String curUserId=ContextUtil.getCurrentUserId().toString();
		//根据任务ID获取任务
		Task task=taskService.getTask(taskId);
		TaskAgent taskAgent = null;
		if(task!=null && curUserId.equals(task.getAssignee())){
			//如果任务已经存在代办，则先删除该任务的所有代办，保证一个代办多次代办只有一条记录
			taskAgentService.delTaskGrants(Long.valueOf(taskId));
			//更改任务的执行人、对应修改数据库JBPM_Task表中的assigner字段
			taskService.assignTask(taskId, userId);
			//向TaskAgent表中新增记录、用于在查询代办事项的时候区分任务为是否代办任务
			taskAgent = new TaskAgent();
			//设置taskId
			taskAgent.setTaskId(Long.valueOf(taskId));
			taskAgent.setFromUserId(Long.valueOf(curUserId));
			AppUser appUser1 = appUserService.get(Long.valueOf(curUserId));
			taskAgent.setFromUserName(appUser1.getFullname());
			taskAgent.setToUserId(Long.valueOf(userId));
			AppUser appUser2 = appUserService.get(Long.valueOf(userId));
			taskAgent.setToUserName(appUser2.getFullname());
			//向代办人发送消息
			String msg=request.getParameter("msg");
			taskAgent.setRemark(msg);
			taskAgentService.save(taskAgent);
			String newMsg=ContextUtil.getCurrentUser().getFullname()+"将您设为"+task.getActivityName()+"的代办处理人代办信息为:"+msg;
			if(StringUtils.isNotEmpty(msg)){
				//添加短信息提示
				shortMessageService.save(AppUser.SYSTEM_USER,userId,newMsg,ShortMessage.MSG_TYPE_TASK);
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}
	
	/**
	 * 释放任务
	 * @return
	 */
	public String unlock(){
		String taskId=getRequest().getParameter("taskId");
		Task task=taskService.getTask(taskId);
		
		String curUserId=ContextUtil.getCurrentUserId().toString();
		
		if(task!=null && curUserId.equals(task.getAssignee())){//为本人的任务，并且尚未完成才能解锁
			taskService.assignTask(task.getId(), null);
			setJsonString("{success:true,unlocked:true}");
		}else{
			setJsonString("{success:true,unlocked:false}");
		}
		
		return SUCCESS;
	}
	
	/**
	 * 锁定任务
	 * @return
	 */
	public String lock(){
		
		String taskId=getRequest().getParameter("taskId");
		Task task=taskService.getTask(taskId);
		
		if(task!=null && task.getAssignee()==null){//该任务尚未被分配，或该任务已经被处理完毕
			taskService.assignTask(task.getId(), ContextUtil.getCurrentUserId().toString());
			setJsonString("{success:true,hasAssigned:false}");
		}else{
			setJsonString("{success:true,hasAssigned:true}");
		}
		
		return SUCCESS;
	}
	
	/**
	 * 首页代办显示
	 * @author F3222507
	 * @return
	 */
    public String display(){
    	//初始化分页数据
		PagingBean pb=new PagingBean(0, 8);//获取前八条数据
		String username = getRequest().getParameter("un");
		String userId = "";
		if(StringUtils.isEmpty(username)){
			userId = ContextUtil.getCurrentUserId().toString();
		}else{
			userId = appUserService.findByUserName(username).getId();
		}
		List<TaskInfo> tasks=flowTaskService.getTasksByUserIdFromView(userId,pb,null,null);
		//把查询结果封装到request范围内
        getRequest().setAttribute("taskList", tasks);
        getRequest().setAttribute("username", username);
        //根据display 去Struts.xml文件中找对对应的jsp文件
		return "display";
	}
    /**
     * 检测当前任务是否被锁定，如果是自己的或者未锁定，则返回TRUE,
     * 已经被他人锁定，则返回FALSE
     * @return
     */
    public String check(){
    	
    	
		String taskId=getRequest().getParameter("taskId");
		Task task=taskService.getTask(taskId);
		String cruUserId=ContextUtil.getCurrentUserId().toString();
		if(task!=null &&task.getAssignee()!=null&&task.getAssignee().equals(cruUserId)){//该任务尚未被分配，或该任务已经被处理完毕
			setJsonString("{success:true}");
		}else if(task!=null &&task.getAssignee()==null){
			taskService.assignTask(task.getId(),cruUserId );
			setJsonString("{success:true,assigned:true}");
		}else if(task!=null && isDaiLi(task.getAssignee())){
			taskService.assignTask(task.getId(),cruUserId );
			setJsonString("{success:true,assigned:true}");
		}else{
			setJsonString("{success:true,assigned:false}");
		}
		return SUCCESS;
	}
    
    public boolean isDaiLi(String assignee){
    	boolean result = false;
    	List<UserAgent> userAgentList = userAgentService.getByGrantUId(ContextUtil.getCurrentUserId());
    	List<String> list = new ArrayList<String>();
    	if(null != userAgentList){
    		for(UserAgent ua:userAgentList){
        		list.add(ua.getUserId().toString());
    		}
    	}
    	result = list.contains(assignee);
    	return result;
    }
    /**
	 * 流程任务修改代办人
	 * @author liusicen
	 * @return
	 */
	public String changeAssignId(){
		HttpServletRequest request=getRequest();
		String taskId=request.getParameter("taskId");
		//获取代办人ID
		String userId=request.getParameter("userId");
		//根据任务ID获取任务
		Task task=taskService.getTask(taskId);
		TaskAgent taskAgent = null;
		if(task!=null&&userId!=null&&StringUtils.isNotEmpty(userId)){
			String assignnee=task.getAssignee();
			taskAgentService.delTaskGrants(Long.valueOf(taskId));
			//更改任务的执行人、对应修改数据库JBPM_Task表中的assigner字段
			taskService.assignTask(taskId, userId);
			//向TaskAgent表中新增记录、用于在查询代办事项的时候区分任务为是否代办任务
			taskAgent = new TaskAgent();
			//设置taskId
			taskAgent.setTaskId(Long.valueOf(taskId));
			taskAgent.setFromUserId(Long.valueOf(assignnee));
			AppUser appUser1 = appUserService.get(Long.valueOf(assignnee));
			taskAgent.setFromUserName(appUser1.getFullname());
			taskAgent.setToUserId(Long.valueOf(userId));
			AppUser appUser2 = appUserService.get(Long.valueOf(userId));
			taskAgent.setToUserName(appUser2.getFullname());
			//向代办人发送消息
			String msg=request.getParameter("msg");
			taskAgent.setRemark(msg);
			taskAgentService.save(taskAgent);
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}
}
