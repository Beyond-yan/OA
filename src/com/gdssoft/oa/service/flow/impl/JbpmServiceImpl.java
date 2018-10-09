package com.gdssoft.oa.service.flow.impl;

/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
 */
import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.dom4j.Attribute;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.hibernate.Session;
import org.jbpm.api.Execution;
import org.jbpm.api.ExecutionService;
import org.jbpm.api.HistoryService;
import org.jbpm.api.ProcessDefinition;
import org.jbpm.api.ProcessDefinitionQuery;
import org.jbpm.api.ProcessEngine;
import org.jbpm.api.ProcessInstance;
import org.jbpm.api.RepositoryService;
import org.jbpm.api.TaskService;
import org.jbpm.api.history.HistoryProcessInstance;
//import org.jbpm.pvm.internal.model.Transition;
import org.jbpm.api.model.Transition;
import org.jbpm.api.task.Participation;
import org.jbpm.api.task.Task;
//import org.jbpm.pvm.internal.env.Environment;
import org.jbpm.pvm.internal.env.EnvironmentFactory;
import org.jbpm.pvm.internal.env.EnvironmentImpl;
import org.jbpm.pvm.internal.history.model.HistoryProcessInstanceImpl;
import org.jbpm.pvm.internal.id.DatabaseDbidGenerator;
import org.jbpm.pvm.internal.id.PropertyImpl;
import org.jbpm.pvm.internal.model.ActivityImpl;
import org.jbpm.pvm.internal.model.ExecutionImpl;
import org.jbpm.pvm.internal.model.ProcessDefinitionImpl;
import org.jbpm.pvm.internal.model.TransitionImpl;
import org.jbpm.pvm.internal.session.DbSession;
import org.jbpm.pvm.internal.svc.TaskServiceImpl;
import org.jbpm.pvm.internal.task.TaskDefinitionImpl;
import org.jbpm.pvm.internal.task.TaskImpl;

import com.gdssoft.core.Constants;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.jbpm.jpdl.Node;
import com.gdssoft.core.util.AppUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.StringUtil;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.action.flow.FlowRunInfo;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.flow.FormData;
import com.gdssoft.oa.model.flow.ProDefinition;
import com.gdssoft.oa.model.flow.ProUserAssign;
import com.gdssoft.oa.model.flow.ProcessForm;
import com.gdssoft.oa.model.flow.ProcessFormNextTask;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.archive.ArchivesService;
import com.gdssoft.oa.service.flow.FormDataService;
import com.gdssoft.oa.service.flow.JbpmService;
import com.gdssoft.oa.service.flow.ProDefinitionService;
import com.gdssoft.oa.service.flow.ProUserAssignService;
import com.gdssoft.oa.service.flow.ProcessFormNextTaskService;
import com.gdssoft.oa.service.flow.ProcessFormService;
import com.gdssoft.oa.service.flow.ProcessRunService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.SysConfigService;
import com.gdssoft.oa.service.system.UserSubService;


public class JbpmServiceImpl extends PropertyImpl implements JbpmService{

	private static final Log logger = LogFactory.getLog(JbpmServiceImpl.class);

	@Resource
	private ProcessEngine processEngine;
	@Resource
	private ArchivesService archivesService;
	@Resource
	private RepositoryService repositoryService;
	@Resource
	private ProcessFormService processFormService;
	@Resource
	private ExecutionService executionService;

	@Resource
	private ProDefinitionService proDefinitionService;

	@Resource
	private TaskService taskService;

	@Resource
	private HistoryService historyService;
	
	@Resource
	private FormDataService formDataService;
	@Resource
	private ProcessFormNextTaskService processFormNextTaskService;
	@Resource
	private ProUserAssignService proUserAssignService;

	@Resource
	private AppUserService appUserService;
	
	@Resource
	private UserSubService userSubService;
	
	@Resource
	private SysConfigService sysConfigService;


	// TODO 需要去掉该注入方式，把该运行服务转至其他
	@Resource
	private ProcessRunService processRunService;

	@Override
	public Task getTaskById(String taskId) {

		Task task = taskService.getTask(taskId);

		return task;
	}
	/**
	 * 任务指定执行
	 * 
	 * @param taskId
	 * @param userId
	 */
	public void assignTask(String taskId, String userId) {
		taskService.assignTask(taskId, userId);
	}

	/**
	 * 删除流程定义，同时也删除该流程的相关数据，包括启动的实例，表单等相关的数据
	 * 
	 * @param defId
	 */
	public void doUnDeployProDefinition(Long defId) {

		// 删除processRun 相关的数据
		processRunService.removeByDefId(defId);

		ProDefinition pd = proDefinitionService.get(defId);
		if (pd != null) {
			// 删除Jbpm的流程定义
			repositoryService.deleteDeploymentCascade(pd.getDeployId());

			// 删除流程定义
			proDefinitionService.remove(pd);
		}
	}

	/**
	 * 发布或更新流程定义
	 * 
	 * @param proDefinition
	 * @return
	 */
	public ProDefinition saveOrUpdateDeploy(ProDefinition proDefinition) {
		// 添加流程定义及发布流程至Jbpm流程表中
		if (proDefinition.getDeployId() == null) {
			if (logger.isDebugEnabled()) {
				logger.debug("deploy now===========");
			}
			String deployId = repositoryService.createDeployment()
					.addResourceFromString("process.jpdl.xml",
							proDefinition.getDefXml()).deploy();

			proDefinition.setDeployId(deployId);

			proDefinitionService.save(proDefinition);

		} else {
			// 先从数据库中移除，保证下次从数据库取出来的是旧的记录而不是Hibernate中的缓存的记录
			proDefinitionService.evict(proDefinition);

			ProDefinition proDef = proDefinitionService.get(proDefinition
					.getDefId());
			// 需要比较数据库的xml文件与现在更新的xml文件是否不相同，若不相同则删除原来的发布并布新的流程
			if (!proDef.getDefXml().equals(proDefinition.getDefXml())) {
				if (proDef.getDeployId() != null) {
					// 不进行删除所有旧流程的东西，保留旧流程运行中的信息。repositoryService.deleteDeploymentCascade(deploymentId)
					repositoryService.deleteDeployment(proDef.getDeployId());
				}
				String deployId = repositoryService.createDeployment()
						.addResourceFromString("process.jpdl.xml",
								proDefinition.getDefXml()).deploy();
				proDefinition.setDeployId(deployId);
			}

			proDefinitionService.merge(proDefinition);
		}

		return proDefinition;
	}

	/**
	 * 按流程key取得Jbpm最新的流程定义
	 * 
	 * @param processKey
	 * @return
	 */
	public ProcessDefinition getProcessDefinitionByKey(String processKey) {
		List<ProcessDefinition> list = repositoryService
				.createProcessDefinitionQuery()
				.processDefinitionKey(processKey).orderDesc(
						ProcessDefinitionQuery.PROPERTY_VERSION).list();
		if (list != null && list.size() > 0) {
			return list.get(0);
		}
		return null;
	}

	/**
	 * 按流程key取得流程定义
	 * 
	 * @return
	 */
	public ProDefinition getProDefinitionByKey(String processKey) {
		ProcessDefinition processDefinition = getProcessDefinitionByKey(processKey);
		if (processDefinition != null) {
			ProDefinition proDef = proDefinitionService
					.getByDeployId(processDefinition.getDeploymentId());
			return proDef;
		}
		return null;
	}

	/**
	 * 按流程定义id取得流程定义的XML
	 * 
	 * @param defId
	 * @return
	 */
	public String getDefinitionXmlByDefId(Long defId) {
		ProDefinition proDefinition = proDefinitionService.get(defId);
		return proDefinition.getDefXml();
	}

	/**
	 * 按发布id取得流程定义的XML
	 */
	public String getDefinitionXmlByDpId(String deployId) {
		ProDefinition proDefintion = proDefinitionService
				.getByDeployId(deployId);
		return proDefintion.getDefXml();
	}

	/**
	 * 按执行实例取得流程的定义
	 * 
	 * @param exeId
	 */
	public String getDefinitionXmlByExeId(String exeId) {
		String pdId = executionService.findExecutionById(exeId)
				.getProcessDefinitionId();
		String deployId = repositoryService.createProcessDefinitionQuery()
				.processDefinitionId(pdId).uniqueResult().getDeploymentId();
		return getDefinitionXmlByDpId(deployId);
	}

	/**
	 * 按流程例id取得流程定义的XML
	 */
	public String getDefinitionXmlByPiId(String piId) {
		ProcessInstance pi = executionService.createProcessInstanceQuery()
				.processInstanceId(piId).uniqueResult();
		ProcessDefinition pd = repositoryService.createProcessDefinitionQuery()
				.processDefinitionId(pi.getProcessDefinitionId())
				.uniqueResult();
		return getDefinitionXmlByDpId(pd.getDeploymentId());
	}

	/**
	 * 通过任务取得流程节义
	 * 
	 * @param taskId
	 * @return
	 */
	public ProcessDefinition getProcessDefinitionByTaskId(String taskId) {
		TaskImpl task = (TaskImpl) taskService.getTask(taskId);
		ProcessInstance pi = null;
		if (task.getSuperTask() != null) {
			pi = task.getSuperTask().getProcessInstance();
		} else {
			pi = task.getProcessInstance();
		}
		ProcessDefinition pd = repositoryService.createProcessDefinitionQuery()
				.processDefinitionId(pi.getProcessDefinitionId())
				.uniqueResult();
		return pd;
	}

	/**
	 * 取得流程实例
	 * 
	 * @param piId
	 * @return
	 */
	public ProcessInstance getProcessInstance(String piId) {
		ProcessInstance pi = executionService.createProcessInstanceQuery()
				.processInstanceId(piId).uniqueResult();
		return pi;
	}

	/**
	 * 通过流程定义取得所有的任务列表
	 * 
	 * @param defId
	 * @return
	 */
	public List<Node> getTaskNodesByDefId(Long defId) {
		ProDefinition proDefinition = proDefinitionService.get(defId);
		return getTaskNodesFromXml(proDefinition.getDefXml(), false, false);
	}

	/**
	 * 取得可跳转所有节点（除开始节点以外的所有任务节点与结束节点）
	 * 
	 * @param defId
	 * @return
	 */
	public List<Node> getJumpNodesByDeployId(String deployId) {
		ProDefinition proDefinition = proDefinitionService
				.getByDeployId(deployId);
		return getTaskNodesFromXml(proDefinition.getDefXml(), false, true);
	}

	/**
	 * 加载需要填写表单的流程节点
	 * 
	 * @param defId
	 * @return
	 */
	public List<Node> getFormNodes(Long defId) {
		ProDefinition proDefinition = proDefinitionService.get(defId);
		return getTaskNodesFromXml(proDefinition.getDefXml(), true, false);
	}

	/**
	 * 取得开始节点名称
	 * 
	 * @param proDefinition
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getStartNodeName(ProDefinition proDefinition) {

		// 检查某个目录下是否存在这个命名为“开始”的节点,兼容旧版本的写法
		String filePath = AppUtil.getAppAbsolutePath() + "/WEB-INF/FlowForm/"
				+ proDefinition.getName() + "/开始.vm";

		File file = new File(filePath);

		if (file.exists()) {// 存在该文件，则返回
			return "开始";
		}
		try {
			Element root = DocumentHelper.parseText(proDefinition.getDefXml().trim()).getRootElement();
			for (Element elem : (List<Element>) root.elements()) {
				String tagName = elem.getName();
				if ("start".equals(tagName)) {
					Attribute nameAttr = elem.attribute("name");
					if (nameAttr != null) {
						return nameAttr.getValue();
					}
					break;
				}
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			logger.error(ex.getMessage());
		}
		return "开始";
	}

	/**
	 * 从XML文件中取得任务节点名称列表
	 * 
	 * @param xml
	 * @param includeStart
	 *            是否包括启动节点
	 * @param includeEnd
	 *            是否包括结束节点
	 * @return
	 */
	@SuppressWarnings("unchecked")
	private List<Node> getTaskNodesFromXml(String xml, boolean includeStart,
			boolean includeEnd) {
		List<Node> nodes = new ArrayList<Node>();
		try {
			Element root = DocumentHelper.parseText(xml).getRootElement();
			for (Element elem : (List<Element>) root.elements()) {
				String type = elem.getQName().getName();
				if ("task".equalsIgnoreCase(type)) {
					if (elem.attribute("name") != null) {
						Node node = new Node(elem.attribute("name").getValue(),
								"任务节点");
						nodes.add(node);
					}
				} else if (includeStart && "start".equalsIgnoreCase(type)) {
					if (elem.attribute("name") != null) {
						Node node = new Node(elem.attribute("name").getValue(),
								"开始节点");
						nodes.add(node);
					}
				} else if (includeEnd && type.startsWith("end")) {
					Node node = new Node(elem.attribute("name").getValue(),
							"结束节点");
					nodes.add(node);
				}
			}
		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}
		return nodes;
	}

	
	private String getAssignInfoFromXml(String xml,String name) {
		String assignInfo="";
		try {
			Element root = DocumentHelper.parseText(xml).getRootElement();
			for (Element elem : (List<Element>) root.elements()) {
				String type = elem.getQName().getName();
				if ("task".equalsIgnoreCase(type)) {
					if (name.equals(elem.attribute("name").getValue())) {
						if(elem.attribute("assignee")!=null){
							assignInfo=elem.attribute("assignee").getValue();
							break;
						}
					}
				}
			}
			// 清除其已有的跳转连接
			// curActivity.getOutgoingTransitions().clear();
		} catch (Exception ex) {
			logger.error(ex.getMessage());
		} finally {
		}
		return assignInfo;
	}
	@SuppressWarnings("unchecked")
	public List<Node> getValidNodesFromXml(String xml) {
		List<Node> nodes = new ArrayList<Node>();
		try {
			Element root = DocumentHelper.parseText(xml).getRootElement();
			for (Element elem : (List<Element>) root.elements()) {
				String type = elem.getQName().getName();
				if ("task".equalsIgnoreCase(type)) {
					if (elem.attribute("name") != null) {
						Node node = new Node(elem.attribute("name").getValue(),
								"任务节点");
						nodes.add(node);
					}
				} else if ("fork".equalsIgnoreCase(type)) {
					if (elem.attribute("name") != null) {
						Node node = new Node(elem.attribute("name").getValue(),
								"同步节点");
						nodes.add(node);
					}
				} else if ("foreach".equalsIgnoreCase(type)) {
					if (elem.attribute("name") != null) {
						Node node = new Node(elem.attribute("name").getValue(),
								"循环节点");
						nodes.add(node);
					}
				} else if ("join".equalsIgnoreCase(type)) {
					if (elem.attribute("name") != null) {
						Node node = new Node(elem.attribute("name").getValue(),
								"汇集节点");
						nodes.add(node);
					}
				} else if (type.startsWith("end")) {
					Node node = new Node(elem.attribute("name").getValue(),
							"结束节点");
					nodes.add(node);
				}
			}
		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}
		return nodes;
	}

	/**
	 * 启动工作流
	 * 
	 * @param deployId
	 * @param variables
	 */
	public String startProcess(String deployId, FlowRunInfo runInfo) {
		ProcessInstance pi=null;
		try {
			ProcessDefinitionImpl pd = (ProcessDefinitionImpl) repositoryService
					.createProcessDefinitionQuery().deploymentId(deployId)
					.uniqueResult();
			//List<ProcessDefinition> processDefinitions = processEngine.getRepositoryService().createProcessDefinitionQuery().list();
			//clearSession();
			// 启动工作流
			@SuppressWarnings("unchecked")
			Map<String, Object> variables = runInfo.getVariables();
			initJbpmDbid();
			pi = executionService.startProcessInstanceById(pd.getId(), variables);
			System.out.println("PIPIPIPIPIPI=="+pi);
			List<Task> taskList = getTasksByPiId(pi.getId());

			if (taskList.size() == 0) {
				return pi.getId();
			}
			
			Task task = taskList.get(0);

			String assignId = (String) variables.get(Constants.FLOW_ASSIGN_ID);
			boolean isTransitionExist = false;
			boolean isDaynic = false;
			String destName = runInfo.getDestName();
			String sourceName = task.getName();

			if (StringUtils.isNotEmpty(destName)) {
				String signalName = null;
				// 取得下一跳转任务的名称
				List<Transition> trans = getTransitionsByPiId(pi.getId());
				for (Transition tran : trans) {
					if (tran.getDestination() != null
							&& destName.equals(tran.getDestination().getName())) {// 查看目标名称是否相符
						signalName = tran.getName();
						isTransitionExist = true;
						break;
					}
				}
				// 完成任务之前，根据当前的跳转是否需要创建
				if (!isTransitionExist) {
					addOutTransition(pd, sourceName, destName);
					signalName = "to" + destName;
					isDaynic = true;
				}
				taskService.completeTask(task.getId(), signalName);

				if (isDaynic) {
					removeOutTransition(pd, sourceName, destName);
				}
			}

			// 检查下一步任务是否需要进行会签的工作，若需要，则取得下一任务，并且进行生成会签子任务
			String signUserIds = (String) variables.get(Constants.FLOW_SIGN_USERIDS);
			String omLeaders = (String) variables.get("outMeeting_leaders");
			
			System.out.println("--------------flowsignUserIds:"+signUserIds);
			// 下一任务为会签任务
			/*if (StringUtils.isNotEmpty(signUserIds)) {
				// 取得下一个即将需要处理的任务
				List<Task> newTasks = getTasksByPiId(pi.getId());
				for (Task nTask : newTasks) {
					newTask(nTask.getId(), signUserIds);
				}
			} else {
				assignTask(pi, pd, assignId, null);
			}*/
			if (StringUtils.isNotEmpty(signUserIds) || StringUtils.isNotEmpty(omLeaders)) {
				
				// 取得下一个即将需要处理的任务
				List<Task> newTasks = getTasksByPiId(pi.getId());
				for (Task nTask : newTasks) {
					if("领导批示".equals(nTask.getActivityName())){
						if(StringUtils.isNotEmpty(omLeaders)){
							newTask(nTask.getId(), omLeaders, variables);
						}
					}else{ 
						newTask(nTask.getId(), signUserIds, variables);
					}
					//break;	//!
				}
			} else {
				assignTask(pi, pd, assignId, null);
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("-------------startProcess:"+e);
		}
//		System.out.println("PIPIPIPIPIPIid="+pi);
//		if(pi!=null) {
			return pi.getId();
//		}else {
//			return null;
//		}
	}

	/**
	 * 启动工作流
	 * 
	 * @param deployId
	 * @param variables
	 */
	public String startProcess(String deployId, Map variables) {

		ProcessDefinition pd = repositoryService.createProcessDefinitionQuery()
				.deploymentId(deployId).uniqueResult();
		//clearSession();
		// 启动工作流
		ProcessInstance pi = executionService.startProcessInstanceById(pd
				.getId(), variables);
		String assignId = (String) variables.get(Constants.FLOW_ASSIGN_ID);

		// 检查下一步任务是否需要进行会签的工作，若需要，则取得下一任务，并且进行生成会签子任务
		String signUserIds = (String) variables
				.get(Constants.FLOW_SIGN_USERIDS);
		// 下一任务为会签任务
		if (StringUtils.isNotEmpty(signUserIds)) {
			// 取得下一个即将需要处理的任务
			List<Task> newTasks = getTasksByPiId(pi.getId());
			for (Task nTask : newTasks) {
				newTask(nTask.getId(), signUserIds,variables);
				break;
			}
		} else {
			assignTask(pi, pd, assignId, null);
		}

		return pi.getId();
	}

	/**
	 * 通过ExecutionId取得processInstance
	 * 
	 * @param executionId
	 * @return
	 */
	public ProcessInstance getProcessInstanceByExeId(String executionId) {
		Execution execution = executionService.findExecutionById(executionId);
		return (ProcessInstance) execution.getProcessInstance();
	}

	public ProcessInstance getProcessInstanceByTaskId(String taskId) {
		TaskImpl taskImpl = (TaskImpl) taskService.getTask(taskId.toString());
		if (taskImpl == null) {
			return null;
		}
		if (taskImpl.getSuperTask() != null) {// 若当前任务存在父任务，应取得其父任务
			taskImpl = taskImpl.getSuperTask();
		}
		return taskImpl.getProcessInstance();
	}

	/**
	 * 任务指派
	 * 
	 * @param pi
	 * @param pd
	 * @param assignId
	 */
	public void assignTask(ProcessInstance pi, ProcessDefinition pd,
			String assignId, String taskName) {

		if (pd == null) {
			pd = repositoryService.createProcessDefinitionQuery()
					.processDefinitionId(pi.getProcessDefinitionId())
					.uniqueResult();
		}
		// 取得当前任务的名称，然后根据该任务名称以及流程定义，查看该任务将由哪一个用户或用户组来处理比较合适
		// Iterator<String>
		// activityNames=pi.findActiveActivityNames().iterator();
		List<Task> taskList = null;

		// 会签任务
		if (StringUtils.isNotEmpty(taskName)) {
			taskList = taskService.createTaskQuery().processInstanceId(
					pi.getId()).activityName(taskName).list();
		}
		// 有可能为并发任务列表
		if (taskList == null || taskList.size() == 0) {
			taskList = getTasksByPiId(pi.getId());
		}
		// 查看是否在assignId指定下一每个任务的处理人员
		Map<String, String> taskUserIdMap = null;
		if (assignId != null && assignId.indexOf("|") != -1) {
			taskUserIdMap = StringUtil.getMapFromString(assignId);
		}

		for (Task task : taskList) {
			TaskImpl taskImpl = (TaskImpl) task;
			// 若原来的任务已有执行人,则保持不变.
			if ((task.getAssignee() != null&&!"".equals(task.getAssignee()))
					|| taskImpl.getParticipations().size() > 0)
				continue;
			if(taskImpl.getSubTasks()!=null&&taskImpl.getSubTasks().size()>0){
				continue;
			}
			// 进行任务的授权用户的操作
			if (StringUtils.isNotEmpty(assignId)) {// 若在流程执行过程中，用户在表单指定了下一步的执行人员，则流程会自动指派至该人来执行
				String taskUserId = assignId;
				if (taskUserIdMap != null) {
					taskUserId = taskUserIdMap.get(task.getName());
				}
				String[] userIds = taskUserId.split("[,]");
				if (userIds != null && userIds.length > 1) {
					for (String uId : userIds) {// 多个用户
						taskService.addTaskParticipatingUser(task.getId(), uId,
								Participation.CANDIDATE);
					}
				} else {
					taskService.assignTask(task.getId(), taskUserId);
				}
				continue;
			}

			// 取得对应的用户
			ProUserAssign assign = proUserAssignService
					.getByDeployIdActivityName(pd.getDeploymentId(), task
							.getActivityName());

			if (assign != null) {

				// 流程需要重新转回给流程启动者
				if (Constants.FLOW_START_ID.equals(assign.getUserId())) {
					// 取得流程启动的ID
					AppUser flowStartUser = (AppUser) executionService
							.getVariable(pi.getId(), Constants.FLOW_START_USER);
					if (flowStartUser != null) {// 流程启动人都不为空
						AppUser realUser=appUserService.findByUserName(flowStartUser.getUsername());
						taskService.assignTask(task.getId(), realUser
								.getUserId().toString());
					}
				} else if (Constants.FLOW_SUPER_ID.equals(assign.getUserId())) {// 由上司处理
					AppUser flowStartUser = (AppUser) executionService
							.getVariable(pi.getId(), Constants.FLOW_START_USER);
					// 取得流程者的上司
					if (flowStartUser != null) {
						List<Long> superUserIds = userSubService
								.upUser(flowStartUser.getUserId());

						for (Long userId : superUserIds) {
							taskService.addTaskParticipatingUser(task.getId(),
									userId.toString(), Participation.CANDIDATE);
						}
						if (superUserIds.size() == 0) {// 若没有上司，则流程会流回流程启动者自己来处理
							taskService.addTaskParticipatingUser(task.getId(),
									flowStartUser.getUserId().toString(),
									Participation.CANDIDATE);
						}

					}
				} else if (StringUtils.isNotEmpty(assign.getUserId())) {// 用户优先处理该任务
					String[] userIds = assign.getUserId().split("[,]");
					// 查看当前用户是否为多个用户，若为多个用户，则需要指派为多个用户为候选的人员，否则直接指到由该用户来执行
					if (userIds != null && userIds.length > 1) {
						for (String uId : userIds) {
							taskService.addTaskParticipatingUser(task.getId(),
									uId, Participation.CANDIDATE);
						}
					} else {
						taskService
								.assignTask(task.getId(), assign.getUserId());
					}
				}

				if (StringUtils.isNotEmpty(assign.getRoleId())) {// 角色中的人员成为该任务的候选人员
					String[] roleIds = assign.getRoleId().split("[,]");
					if (roleIds != null) {
						System.out.println("---------roleIds----------111111111----------"+roleIds);
						for (String roleId : roleIds) {
							List<AppUser> uList=appUserService.searchUser(new Long(roleId));
							for(AppUser au:uList){
								taskService.addTaskParticipatingUser(task.getId(),
										au.getUserId().toString(), Participation.CANDIDATE);
							}
							/*taskService.addTaskParticipatingGroup(task.getId(),
									roleId, Participation.CANDIDATE);*/
						}
					}
				}

			} else {// 若流程表单中，该任务没有指定任何人员，则任务会直接流回流程启动人员那里
				AppUser flowStartUser = (AppUser) executionService.getVariable(
						pi.getId(), Constants.FLOW_START_USER);
				if (flowStartUser != null) {// 流程启动人都不为空
					taskService.assignTask(task.getId(), flowStartUser
							.getUserId().toString());
				} else {
					taskService.assignTask(task.getId(), ContextUtil
							.getCurrentUserId().toString());
				}
			}
		}// end of for
	}

	/**
	 * 显示某个流程当前任务对应的所有出口
	 * 
	 * @param piId
	 * @return
	 */
	public List<Transition> getTransitionsForSignalProcess(String piId) {
		ProcessInstance pi = executionService.findProcessInstanceById(piId);
		EnvironmentFactory environmentFactory = (EnvironmentFactory) processEngine;
		EnvironmentImpl env = environmentFactory.openEnvironment();

		try {
			ExecutionImpl executionImpl = (ExecutionImpl) pi;
			ActivityImpl activity = executionImpl.getActivity();

			return (List<Transition>) activity.getOutgoingTransitions();
		} finally {
			env.close();
		}
	}

	// /**
	// * 取得任务对应的所有跳转名称
	// */
	// public Set<String> getTransitionsByTaskId(Long taskId){
	// return taskService.getOutcomes(taskId.toString());
	// }

	@SuppressWarnings("unchecked")
	public List<Transition> getTransitionsByTaskId(String taskId) {
		List<Transition> result = new ArrayList<Transition>();
		TaskImpl task = (TaskImpl) taskService.getTask(taskId);
		if (task.getSuperTask() != null) {// 取得其父任务对应的输出transition
			task = task.getSuperTask();
		}
		EnvironmentFactory environmentFactory = (EnvironmentFactory) processEngine;
		EnvironmentImpl env = environmentFactory.openEnvironment();
		try {
			ProcessDefinitionImpl pd = (ProcessDefinitionImpl) task
					.getProcessInstance().getProcessDefinition();
			ActivityImpl activityFind = pd.findActivity(task.getActivityName());

			if (activityFind != null) {
				result = (List<Transition>) activityFind.getOutgoingTransitions();
			}
		} finally {
			env.close();
		}
		return result;
	}

	/**
	 * 取得某个节点的所有跳转
	 * 
	 * @param definition
	 *            流程定义
	 * @nodeName 节点名称
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<Transition> getNodeOuterTrans(ProcessDefinition definition,
			String nodeName) {
		List<Transition> result = new ArrayList<Transition>();
		EnvironmentFactory environmentFactory = (EnvironmentFactory) processEngine;
		EnvironmentImpl env = environmentFactory.openEnvironment();
		try {
			ProcessDefinitionImpl pd = (ProcessDefinitionImpl) definition;
			ActivityImpl activityFind = pd.findActivity(nodeName);

			if (activityFind != null) {
				result = (List<Transition>) activityFind.getOutgoingTransitions();
			}
		} finally {
			env.close();
		}
		return result;
	}

	@SuppressWarnings("unchecked")
	public List<Transition> getTransitionsByPiId(String piId) {
		List<Transition> result = new ArrayList<Transition>();
		ExecutionImpl pi = (ExecutionImpl) getProcessInstance(piId);
		// 只有一个任务节点在运行的情况符合
		List<Task> taskList = getTasksByPiId(pi.getId());
		if (taskList.size() > 0) {
			Task task = taskList.get(0);
			EnvironmentFactory environmentFactory = (EnvironmentFactory) processEngine;
			EnvironmentImpl env = environmentFactory.openEnvironment();
			try {
				ProcessDefinitionImpl pd = pi.getProcessDefinition();
				ActivityImpl activityFind = pd.findActivity(task.getActivityName());
	
				if (activityFind != null) {
					result = (List<Transition>) activityFind.getOutgoingTransitions();
				}
			} finally {
				env.close();
			}
		}
		return result;
	}

	/**
	 * 动态创建连接当前任务节点至名称为destName的节点的Transition
	 * 
	 * @param taskId
	 *            任务节点ID
	 * @param sourceName
	 *            源节点名称
	 * @param destName
	 *            目标节点名称
	 */
	public void addOutTransition(ProcessDefinitionImpl pd, String sourceName,
			String destName) {
		//CustomerLog.customerLog(customerLog, "新增流程走向：Id=" + pd.getId() + ", sourceName=" + sourceName + ", destName=" + destName);

		EnvironmentFactory environmentFactory = (EnvironmentFactory) processEngine;
		EnvironmentImpl env = null;
		try {
			env = environmentFactory.openEnvironment();

			// 取得当前流程的活动定义
			ActivityImpl sourceActivity = pd.findActivity(sourceName);
			// 取得目标的活动定义
			ActivityImpl destActivity = pd.findActivity(destName);

			// 为两个节点创建连接
			TransitionImpl transition = sourceActivity
					.createOutgoingTransition();
			transition.setName("to " + destName);
			transition.setDestination(destActivity);

			sourceActivity.addOutgoingTransition(transition);

		} catch (Exception ex) {
			logger.error(ex.getMessage());
		} finally {
			if (env != null)
				env.close();
		}
	}

	/**
	 * 动态删除连接sourceName与destName的Transition
	 * 
	 * @param taskId
	 * @param sourceName
	 * @param destName
	 */
	public void removeOutTransition(ProcessDefinitionImpl pd,
			String sourceName, String destName) {
		//CustomerLog.customerLog(customerLog, "删除流程走向：Id=" + pd.getId() + ", sourceName=" + sourceName + ", destName=" + destName);
		EnvironmentFactory environmentFactory = (EnvironmentFactory) processEngine;
		EnvironmentImpl env = null;
		try {
			env = environmentFactory.openEnvironment();
			// 取得当前流程的活动定义
			ActivityImpl sourceActivity = pd.findActivity(sourceName);

			// 若存在这个连接，则需要把该连接删除
			@SuppressWarnings("unchecked")
			List<Transition> trans = (List<Transition>) sourceActivity.getOutgoingTransitions();
			for (Transition tran : trans) {
				if (destName.equals(tran.getDestination().getName())) {// 删除该连接
					trans.remove(tran);
					break;
				}
			}
		} catch (Exception ex) {
			logger.error(ex.getMessage());
		} finally {
			if (env != null)
				env.close();
		}
	}

	/**
	 * 从当前的任务节点，通过动态创建任何跳转的连接，可以跳至流程的任何任务节点
	 * 
	 * @param taskId
	 * @return
	 */
	public List<Transition> getFreeTransitionsByTaskId(String taskId) {
		TaskImpl task = (TaskImpl) taskService.getTask(taskId);

		List outTrans = new ArrayList<Transition>();

		if (task.getSuperTask() != null) {// 取得其父任务对应的输出transition
			task = task.getSuperTask();
		}
		EnvironmentFactory environmentFactory = (EnvironmentFactory) processEngine;
		EnvironmentImpl env = null;
		try {
			env = environmentFactory.openEnvironment();
			ProcessDefinitionImpl pd = (ProcessDefinitionImpl) task
					.getProcessInstance().getProcessDefinition();
			ActivityImpl curActivity = pd.findActivity(task.getActivityName());
			ProDefinition proDefinition = proDefinitionService.getByDeployId(pd
					.getDeploymentId());
			// 通过DeployId取得可以跳转的节点
			List<Node> allTaskNodes = getValidNodesFromXml(proDefinition
					.getDefXml());

			// 清除其已有的跳转连接
			// curActivity.getOutgoingTransitions().clear();

			for (Node taskNode : allTaskNodes) {
				if (!taskNode.getName().equals(task.getActivityName())) {
					// 动态创建连接
					TransitionImpl transition = curActivity
							.createOutgoingTransition();
					// 连接的名称加上"to"前缀
					transition.setName("to" + taskNode.getName());
					transition.setDestination(pd.findActivity(taskNode
							.getName()));
					// 同时移除
					curActivity.getOutgoingTransitions().remove(transition);

					outTrans.add(transition);
				}
			}
		} catch (Exception ex) {
			logger.error(ex.getMessage());
		} finally {
			if (env != null)
				env.close();
		}

		return outTrans;
	}
	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.gdssoft.oa.service.flow.JbpmService#getProcessDefintionXMLByPiId(
	 * java.lang.String)
	 */
	public String getProcessDefintionXMLByPiId(String piId) {
		ProcessRun processRun = processRunService.getByPiId(piId);
		return processRun.getProDefinition().getDefXml();
	}

	/**
	 * 取得某流程实例对应的任务列表
	 * 
	 * @param piId 
	 * @return
	 */
	public List<Task> getTasksByPiId(String piId) {
		List<Task> taskList;
		// 同步处理，防止并发报错
		if(piId == null){
			return new ArrayList<Task>();
		}
		taskList = taskService.createTaskQuery().processInstanceId(
				piId).list();
		return taskList;
	}

	/**
	 * 取到节点类型
	 * 
	 * @param xml
	 * @param nodeName
	 * @return
	 */
	public String getNodeType(String xml, String nodeName) {
		String type = "";
		try {
			Element root = DocumentHelper.parseText(xml).getRootElement();
			for (Element elem : (List<Element>) root.elements()) {
				if (elem.attribute("name") != null) {
					String value = elem.attributeValue("name");
					if (value.equals(nodeName)) {
						type = elem.getQName().getName();
						return type;
					}
				}
			}
		} catch (Exception ex) {
			logger.info(ex.getMessage());
		}
		return type;
	}

	protected void clearSession() {
		EnvironmentFactory environmentFactory = (EnvironmentFactory) processEngine;
		EnvironmentImpl env = environmentFactory.openEnvironment();
		try {
			Session session = env.get(Session.class);
			session.clear();
		} finally {
			env.close();
		}
	}
	
	protected void flush() {
		EnvironmentFactory environmentFactory = (EnvironmentFactory) processEngine;
		EnvironmentImpl env = environmentFactory.openEnvironment();
		try {
			Session session = env.get(Session.class);
			session.flush();
		} finally {
			env.close();
		}
	}
    public void saveNextTaskInfoByTaskId(Long taskId,Long formId){
		ProcessFormNextTask processFormNextTask=new ProcessFormNextTask();
		processFormNextTask.setFormId(formId);
		processFormNextTask.setTaskId(taskId);
		processFormNextTaskService.save(processFormNextTask);
    }
	/**
	 * 完成任务,包括子任务
	 * 
	 * @param taskId
	 * @param transitionName
	 * @param destName
	 *            目标节点名称
	 * @param variables
	 */
	public ProcessInstance completeTask(String taskId, String transitionName,
			String destName, Map variables,Boolean freeJump,Long formId) {
		initJbpmDbid();
		TaskImpl taskImpl = (TaskImpl) taskService.getTask(taskId);
		// 源节点名称
		String sourceName = taskImpl.getName();

		// 取得该任务的父任务
		TaskImpl superTask = taskImpl.getSuperTask();

		// 取得该任务对应的流程定义
		ProcessDefinitionImpl pd = (ProcessDefinitionImpl) getProcessDefinitionByTaskId(taskId);
		ProcessInstance pi = null;

		String isForkFlow = (String) variables.get("isForkFlow");
		String joinName=(String) variables.get("joinName");
		if("true".equals(isForkFlow)){
			pi = taskImpl.getProcessInstance();
			List<Task> taskList = getTasksByPiId(pi.getId());
			List<Transition> trans = getFreeTransitionsByTaskId(taskId);
			for (Transition tran : trans) {
				if ("join".equals(tran.getDestination().getType())){
					joinName=tran.getName().replace("to", "");
					break;
				}
			}
			for (Task task : taskList) {
				if(StringUtils.isEmpty(task.getAssignee())){
					addOutTransition(pd, task.getName(), joinName);
//					taskService.completeTask(task.getId(),"to "+joinName);
//					removeOutTransition(pd, task.getName(), joinName);
					try{
						taskService.completeTask(task.getId(),"to "+joinName);
					}catch (Exception e){
						System.out.println("=============="+task.getId());
					}finally{
						removeOutTransition(pd, task.getName(), joinName);
					}
				}
			}
			/*fork中嵌入会签开始*/
			String isJoinFlow = (String) variables.get("isJoinFlow");
			//System.out.print("开始时间========"+new Date().getTime());
			if("true".equals(isJoinFlow)){
				String assignId = "";
				Map<Object,Object> map=processFormNextTaskService.getPreTaskCount(taskId,sourceName);
				if(map!=null&&map.get("NUM")!=null){
					int count=Integer.valueOf(map.get("NUM").toString());
					taskService.setVariables(taskId, variables);
					if(count>1){
						assignId="";
						addOutTransition(pd, taskImpl.getName(), joinName);
						taskService.completeTask(taskImpl.getId(),"to "+joinName);
						removeOutTransition(pd, taskImpl.getName(), joinName);
					}else if(count==1){
						FormData formData=formDataService.getByFormIdFieldName(Long.valueOf(map.get("FORMID").toString()), "forkNextUserId");
						assignId=formData.getStrValue();
						taskService.completeTask(taskId,transitionName);
						// 为下一任务授权
						List<Task> taskList2 = getTasksByPiId(pi.getId());
						if(assignId!=null&&!"".equals(assignId)){
							for (Task task : taskList2) {
								if(StringUtils.isEmpty(task.getAssignee())){
									assignTask(task.getId(),assignId);
								}
							}
						}
					}
				}
				//查询出当前任务的上一步流程批示信息[formId]
//				List<ProcessFormNextTask> processFormNextTaskList = processFormNextTaskService.getByTaskId(new Long(taskId));
//				if(processFormNextTaskList!=null&&processFormNextTaskList.size()>0){
//					Long preFormId=processFormNextTaskList.get(0).getFormId();
//					//根据formId查询出上一步操作所有流程的走向[runId]
//					List<ProcessFormNextTask> processFormNextTaskList2 = processFormNextTaskService.getByFormId(new Long(preFormId));
//					if(processFormNextTaskList2!=null&&processFormNextTaskList2.size()>0){
//						for(ProcessFormNextTask formTask:processFormNextTaskList2){//上一步操作生成任务
//							for (Task task : taskList3) {//当前在办任务
////								TaskImpl taskImpl2 = (TaskImpl) taskService.getTask(task.getId());
////								Long taskId_2=taskImpl2.getTask().getDbid();
//								Long taskId_=new Long(task.getId());
//								if(taskId_.equals(formTask.getTaskId())&&task.getName().equals(sourceName)){//步骤名称与任务名称都一致
//									count++;
////									FormData formData=formDataService.getByFormIdFieldName(preFormId, "forkNextUserId");
////									assignId=formData.getStrValue();
//									//if(count>1)break;
//								}
//							}
//						}
//					}
//					taskService.setVariables(taskId, variables);
//					if(count!=1){
//						assignId="";
//						addOutTransition(pd, taskImpl.getName(), joinName);
//						taskService.completeTask(taskImpl.getId(),"to "+joinName);
//						removeOutTransition(pd, taskImpl.getName(), joinName);
//					}
//					else{
//						FormData formData=formDataService.getByFormIdFieldName(preFormId, "forkNextUserId");
//						assignId=formData.getStrValue();
//						taskService.completeTask(taskId,transitionName);
//						// 为下一任务授权
//						List<Task> taskList2 = getTasksByPiId(pi.getId());
//						if(assignId!=null&&!"".equals(assignId)){
//							for (Task task : taskList2) {
//								if(StringUtils.isEmpty(task.getAssignee())){
//									assignTask(task.getId(),assignId);
//								}
//							}
//						}
//					}
//				}
//				System.out.print("结束时间========"+new Date().getTime());
//				addOutTransition(pd, sourceName, "重新登记");
//				List<Transition> trans = getTransitionsByTaskId(taskId);
//				System.out.print("开始时间========"+new Date().getTime());
				//clearSession();
				// 为下一任务授权
				//taskService.completeTask(taskId);
				return null;
			}
			/*fork中嵌入会签结束*/
			String isEndFlow = (String) variables.get("isEndFlow");
			if("true".equals(isEndFlow)){
				List<Task> taskList2 = getTasksByPiId(pi.getId());
				if(joinName.equals(destName)&&taskList2!=null&&taskList2.size()==1){
					String assignId = (String) variables.get(Constants.FLOW_ASSIGN_ID);
					String joinedName=(String) variables.get("joinedName");
					if("结束".equals(joinedName)){//办结，修改公文状态入库
						ProcessRun processRun = processRunService.getByPiId(pi.getId());
						processRun.setPiId(null);
						processRun.setRunStatus(new Short("2"));
						processRunService.save(processRun);
						Archives archives=archivesService.getArchivesByRunId(processRun.getRunId());
						if(archives != null){
							archives.setStatus(new Short("2"));
							archivesService.save(archives);
						}
					}
					addOutTransition(pd, taskImpl.getName(), joinedName);
					taskService.completeTask(taskImpl.getId(),"to "+joinedName);
					List<Task> taskList3 = getTasksByPiId(pi.getId());
					for (Task task : taskList3) {
						if(StringUtils.isEmpty(task.getAssignee())){
							assignTask(task.getId(),assignId);
						}
					}
					removeOutTransition(pd, taskImpl.getName(), joinedName);
//					try{
//						taskService.completeTask(taskImpl.getId(),"to "+joinedName);
//						List<Task> taskList3 = getTasksByPiId(pi.getId());
//						for (Task task : taskList3) {
//							if(StringUtils.isEmpty(task.getAssignee())){
//								assignTask(task.getId(),assignId);
//							}
//						}
//					}catch(Exception e){
//						e.printStackTrace();
//					}finally{
//						removeOutTransition(pd, taskImpl.getName(), joinedName);
//					}
				}else{
					addOutTransition(pd, taskImpl.getName(), joinName);
					taskService.completeTask(taskImpl.getId(),"to "+joinName);
					removeOutTransition(pd, taskImpl.getName(), joinName);
//					try{
//						taskService.completeTask(taskImpl.getId(),"to "+joinName);
//					}catch(Exception e){
//						e.printStackTrace();
//					}finally{
//						removeOutTransition(pd, taskImpl.getName(), joinName);
//					}
				}
				return null;
			}

			String freeJumpType=(String)variables.get("freeJumpType");
			if("撤回".equals(freeJumpType)){
				taskList = getTasksByPiId(pi.getId());
				List<ProcessFormNextTask> processFormNextTaskList = processFormNextTaskService.getByTaskId(new Long(taskId));
				if(processFormNextTaskList!=null&&processFormNextTaskList.size()>0){
					Long preFormId=processFormNextTaskList.get(0).getFormId();
					List<ProcessFormNextTask> processFormNextTaskList2 = processFormNextTaskService.getByFormId(new Long(preFormId));
					String taskIds="";
					if(processFormNextTaskList2!=null&&processFormNextTaskList2.size()>0){
						for (int i=0;i<processFormNextTaskList2.size();i++) {
							taskIds+=processFormNextTaskList2.get(i).getTaskId()+",";
						}
						for (Task task:taskList) {
							if(taskIds.indexOf(task.getId()+",")>-1&&!taskId.equals(task.getId())){
								addOutTransition(pd, task.getName(), joinName);
								taskService.completeTask(task.getId(),"to "+joinName);
								removeOutTransition(pd, task.getName(), joinName);
							}else if(taskIds.indexOf(task.getId()+",")>-1&&taskId.equals(task.getId())){
								String xname=transitionName.replace("to", "");
								String assignId = (String) variables.get(Constants.FLOW_ASSIGN_ID);
								if(task.getName().equals(xname)){
									assignTask(task.getId(),assignId);
								}else{
									String xml = getProcessDefintionXMLByPiId(pi.getId());
									String assignInfo = getAssignInfoFromXml(xml,xname);
									if(!"".equals(assignInfo)&&assignInfo.indexOf("#")>-1){
										assignInfo=assignInfo.substring(2,assignInfo.length()-1);
										variables.put(assignInfo, "");
									}
									taskService.setVariables(task.getId(), variables);
									addOutTransition(pd, task.getName(), xname);
									taskService.completeTask(task.getId(),"to "+xname);
									removeOutTransition(pd, task.getName(), xname);// 为下一任务授权
									assignTask(pi, pd, assignId, xname);
								}
							}
						}
					}
				}
				saveNextTaskInfoByTaskId(new Long(taskId),new Long(formId));
				return null;
			}
			if("流程编辑".equals(freeJumpType)){
				String xml = getProcessDefintionXMLByPiId(pi.getId());
				String xname=transitionName.replace("to", "");
				String assignInfo = getAssignInfoFromXml(xml,xname);
				if(!"".equals(assignInfo)&&assignInfo.indexOf("#")>-1){
					assignInfo=assignInfo.substring(2,assignInfo.length()-1);
					variables.put(assignInfo, "");
				}
				String assignId = (String) variables.get(Constants.FLOW_ASSIGN_ID);
				taskService.setVariables(taskId, variables);
				addOutTransition(pd, sourceName, xname);
				taskService.completeTask(taskId,"to "+xname);
				removeOutTransition(pd, sourceName, xname);// 为下一任务授权
				assignTask(pi, pd, assignId, xname);
				return null;
			}
		}

		// 查看当前节点与下一任务节点是否存在Transition，
		// 若不存在，则不允许跳转，这时需要动态创建Transition，并且在用完后移除
		boolean isTransitionExist = false;
		boolean isDynamicTran = false;
		boolean isHQTransition=false;
		String freeJumpType=(String)variables.get("freeJumpType");
		if (destName != null) {
			// 取得下一跳转任务的名称
			List<Transition> trans = getTransitionsByTaskId(taskId);
			for (Transition tran : trans) {
				if (tran.getDestination() != null && destName.equals(tran.getDestination().getName())) {// 查看目标名称是否相符
					isTransitionExist = true;
					transitionName = tran.getName();
					break;
				}
			}
			// 完成任务之前，根据当前的跳转是否需要创建
			if (!isTransitionExist) {
				if(superTask!=null){
					sourceName=superTask.getName();
				}
				addOutTransition(pd, sourceName, destName);
				isDynamicTran = true;
				
				// 重新查询步骤
				List<Transition> trans1 = getTransitionsByTaskId(taskId);
				for (Transition tran : trans1) {
					if (tran.getDestination() != null && destName.equals(tran.getDestination().getName())) {// 查看目标名称是否相符
						transitionName = tran.getName();
						break;
					}
				}
			}
		}
		// 是否会签任务
		if (superTask != null) {
			sourceName=superTask.getName();
			pi = superTask.getProcessInstance();
			if (logger.isDebugEnabled()) {
				logger.debug("Super task is not null, task name is:" + superTask.getActivityName());
			}// TODO,会签的其他决策方式,目前仅处理全部签

			// 查看当前下的所有子任务是否已经完成
			if (superTask.getSubTasks() != null) {
				if(freeJump){
					Set<Task> subTasks=superTask.getSubTasks();
					Set<Task> subTasksCopy = new HashSet<Task>();
					subTasksCopy.addAll(subTasks);
					Iterator<Task> it=subTasksCopy.iterator();
					while(it.hasNext()){
						Task task=it.next();
						it.remove();
						superTask.removeSubTask(task);
						taskService.completeTask(task.getId());
					}
					//完成父任务
					taskService.completeTask(superTask.getId(), transitionName);
				} else {
					// 4.0 foke单独处理
					String isForkFlow40 = (String) variables.get("isForkFlow40");
					if ("true".equals(isForkFlow40)) {
						pi = superTask.getProcessInstance();
						List<Task> taskList = getTasksByPiId(pi.getId());
						for (Task task : taskList) {
							TaskImpl taskImpl2 = (TaskImpl) taskService.getTask(task.getId());
							if((taskImpl2.getSubTasks()==null||taskImpl2.getSubTasks().size()==0)&&StringUtils.isEmpty(task.getAssignee())){
								addOutTransition(pd, task.getName(), joinName);
								try{
									taskService.completeTask(task.getId(),"to "+joinName);
								}catch (Exception e){
									System.out.println("=============="+task.getId());
								}finally{
									removeOutTransition(pd, task.getName(), joinName);
								}
							}
						}
						if (superTask.getSubTasks().size() == 1) {// 若只有当前子任务，则表示可以结束目前这个任务
							isHQTransition=true;
							taskService.setVariables(taskId, variables);
							// 完成父任务
							taskService.completeTask(superTask.getId(), transitionName);
							// 完成子任务
							completeChildtaskForFork(taskId);
						} else {
							// 完成子任务，完成后，直接返回则可
							completeChildtaskForFork(taskId);
							return pi;
						}
					} else {
						if (superTask.getSubTasks().size() == 1) {// 若只有当前子任务，则表示可以结束目前这个任务
							boolean isJump=false;
							String jumpName="";
							if(freeJumpType!=null&&freeJumpType.indexOf("特殊处理")!=-1){
								QueryFilter filter = new QueryFilter();
								PagingBean pageBean = new PagingBean(0, 100);
								filter.setPagingBean(pageBean);
								filter.getPagingBean().setPageSize(100000);
								ProcessRun processRun = processRunService.getByPiId(pi.getId());
								filter.addFilter("Q_processRun.runId_L_EQ",processRun.getRunId()+"");
								filter.addSorted("formId", "DESC");
								List<ProcessForm> pfList=processFormService.getAll(filter);
								if(freeJumpType.indexOf("退回")!=-1){
									jumpName=freeJumpType.substring(freeJumpType.indexOf("[")+1,freeJumpType.indexOf("]"));
									isJump=true;
								}else{
									for(ProcessForm pf:pfList){
										if(pf.getStatus()!=null&&pf.getStatus().indexOf("特殊处理")!=-1&&pf.getStatus().indexOf("退回")!=-1){
									        String status=pf.getStatus();
									        jumpName=status.substring(status.indexOf("[")+1,status.indexOf("]"));
											isJump=true;
											break;
										}else if(pf.getStatus()!=null&&pf.getStatus().indexOf("特殊处理")==-1){
											break;
										}
									}
								}
								if(isJump){
									addOutTransition(pd, sourceName, jumpName);
									transitionName="to "+jumpName;
									List<Transition> trans = getTransitionsByTaskId(taskId);
									for(ProcessForm pf:pfList){
										if(pf.getActivityName().equals(jumpName)){
											variables.put(Constants.FLOW_ASSIGN_ID, pf.getCreatorId()+"");
											variables.put(Constants.FLOW_SIGN_USERIDS, null);
											break;
										}
									}
								}
							}
							isHQTransition=true;
							taskService.setVariables(taskId, variables);
							//clearSession();
						
							// 完成子任务
							taskService.completeTask(taskId);
						
							//do4outMeetingFlow(pi,pd,taskImpl);
						
							// 完成父任务
							taskService.completeTask(superTask.getId(), transitionName);
							if(isJump){
								removeOutTransition(pd, sourceName, jumpName);
							}
						} else {
							taskService.setVariables(taskId, variables);
							//clearSession();
							taskService.completeTask(taskId);
							
							//do4outMeetingFlow(pi,pd,taskImpl);
							
							// 完成子任务后，直接返回则可
							return pi;
						}
					}
				}
			}
		} else {// 普通任务，直接完成，进入下一步
			pi = taskImpl.getProcessInstance();
			
			//自动结束空流程_shizenghua
			List<Task> taskList = getTasksByPiId(pi.getId());
			for (Task task : taskList) {
				TaskImpl impl = (TaskImpl) task;
				if(StringUtils.isEmpty(impl.getAssignee()) && (impl.getSubTasks()==null ||impl.getSubTasks().size()==0)){
					taskService.completeTask(impl.getId());
				}
			}

			// 当前节点若在forchech节点里，则 单独处理
			String xml = getProcessDefintionXMLByPiId(pi.getId());
			Object foreachUserId = taskService.getVariable(taskId, "foreachUserId");
			if (foreachUserId != null) {
				int length = 0;
				List<Task> taskList1 = getTasksByPiId(pi.getId());
				for (Task task : taskList1) {
					TaskImpl impl = (TaskImpl) task;
					if (taskService.getVariable(impl.getId(), "foreachUserId") != null) {
						length++;
					}
				}
				String foreachUserIds = (String) variables.get(Constants.FLOW_FOREACH_USERIDS);
				if(StringUtils.isNotEmpty(foreachUserIds)){
					length += foreachUserIds.split(",").length;
					variables.put(Constants.FLOW_FOREACH_USERIDS_LENGTHS, "999999");
				}
				if (freeJump) {
					//处理掉其他在foreach节点里面的任务，并把length改为1
					List<Node> allTaskNodes = getValidNodesFromXml(xml);
					joinName = "合并";
					for (Node node : allTaskNodes) {
						if ("汇集节点".equals(node.getType())) {
							joinName = node.getName();
						}
					}
					for (Task task : taskList1) {
						TaskImpl impl = (TaskImpl) task;
						if (!impl.getId().equals(taskId)) {
							addOutTransition(pd, impl.getName(), joinName);
							taskService.completeTask(impl.getId(), "to " + joinName);
							removeOutTransition(pd, impl.getName(), joinName);
						}
					}
					length = 1;
				}
				if (length == 1) {
					int join = 0;
					for (Execution e : pi.getExecutions()) {
						if ("inactive-join".equals(e.getState())) {
							join++;
						}
					}
					
					//processEngine.getExecutionService().setVariable(pi.getId(), Constants.FLOW_FOREACH_USERIDS_LENGTHS, (join+length) + "");
					variables.put(Constants.FLOW_FOREACH_USERIDS_LENGTHS, (join+length) + "");
				}
			}
			if (freeJumpType!=null) {
				// 处理流程编辑：跳入foreach节点里面的节点
				List<Map<String, String>> xmlList = getMapListsFromXml(xml);
				Map<String, String> destNode = null;
				for (Map<String, String> xmlmap : xmlList) {
					if (xmlmap.get("name") != null && xmlmap.get("name").equals(destName)) {
						destNode = xmlmap;
						break;
					}
				}
				if (destNode != null&& destNode.get("assignee") != null) {
					// 说明跳转进入的是foreach节点里面的节点，将执行人放入流程变量
					String assignee=destNode.get("assignee");
					String var=assignee.substring(2, assignee.length()-1);
					if(variables.get(var)==null){
						variables.put(var, variables.get(Constants.FLOW_ASSIGN_ID));
					}
				}
			}
			taskService.setVariables(taskId, variables);
			// flush();
			taskService.completeTask(taskId, transitionName);
            /*保存上一步处理流程批示信息*/
			if("true".equals(isForkFlow)){
				List<Task> taskList4 = getTasksByPiId(pi.getId());
				List<Task> list = new ArrayList<Task>();
				for(Task task:taskList4)  {  
		            if(!taskList.contains(task)){  
		            	list.add(task);  
		            }  
		        }  
				for(Task task:list){
					if(StringUtils.isEmpty(task.getAssignee())){
						addOutTransition(pd, task.getName(), joinName);
//						taskService.completeTask(task.getId(),"to "+joinName);
//						removeOutTransition(pd, task.getName(), joinName);
						try{
							taskService.completeTask(task.getId(),"to "+joinName);
						}catch (Exception e){
							System.out.println("=============="+task.getId());
						}finally{
							removeOutTransition(pd, task.getName(), joinName);
						}
					}
					saveNextTaskInfoByTaskId(new Long(task.getId()),formId);
				}
			}
		}

		// 若该Transition为动态创建，则需要删除
		if (isDynamicTran) {
			removeOutTransition(pd, sourceName, destName);
		}

		// 流程是否结束了
		boolean isEndProcess = isProcessInstanceEnd(pi.getId());
		if (isEndProcess) { // 流程实例已经结束了，保存结束的状态，返回
			ProcessRun processRun = processRunService.getByPiId(pi.getId());
			if (processRun != null) {
				processRun.setPiId(null);
				processRun.setRunStatus(ProcessRun.RUN_STATUS_FINISHED);
				processRunService.save(processRun);
				Archives archives=archivesService.getArchivesByRunId(processRun.getRunId());
				if(archives != null){
					archives.setStatus(new Short("2"));
					archivesService.save(archives);
				}
			}
			return null;
		}

		// 检查下一步任务是否需要进行会签的工作，若需要，则取得下一任务，并且进行生成会签子任务
		String signUserIds = (String) variables.get(Constants.FLOW_SIGN_USERIDS);
		
		// 下一任务为会签任务
		if (destName != null && StringUtils.isNotEmpty(signUserIds)) {
			System.out.println("会签任务signUserIds:"+signUserIds);
			// 取得下一个即将需要处理的任务
			List<Task> newTasks = getTasksByPiId(pi.getId());
			for (Task nTask : newTasks) {
				if (destName.equals(nTask.getName())) {// 取得下一个任务，并且根据该任务来产生会签子任务,并且授予相应的人员
					newTask(nTask.getId(), signUserIds,variables);
					break;
				}
			}
			return pi;
		} else {
			destName = null;
		}
		
		// 检查下一步任务是foreach
		String foreachUserIds = (String) variables.get(Constants.FLOW_FOREACH_USERIDS);
		if(StringUtils.isNotEmpty(foreachUserIds)){
			//processEngine.getTaskService().setVariables(taskId, variables); 
		}
		
		// 检查下一步任务是fork
		String forkUserIds = (String) variables.get(Constants.FLOW_FORK_USERIDS);
		if(StringUtils.isNotEmpty(forkUserIds)){
			//processEngine.getTaskService().setVariables(taskId, variables); 
		}
		String assignId = (String) variables.get(Constants.FLOW_ASSIGN_ID);
		//判断是否是流程编辑的会签
		if(isHQTransition){
			if(assignId!=null){
				if(assignId.indexOf("$")!=-1){
					Long userId=(Long)executionService.getVariable(pi.getId(), Constants.FLOW_JUMP_USER);
					assignId=userId.toString();
				}
			}
		}
		// 为下一任务授权
		assignTask(pi, null, assignId, destName);

		return pi;
	}
	
	/**
	 * 完成子任务
	 * <pre>
	 * 兼容4.0fork生成的子父任务
	 * 其父任务是由fork节点创建的时候
	 * </pre>
	 * 
	 * @param taskId
	 */
	private void completeChildtaskForFork(String taskId) {
		EnvironmentFactory environmentFactory = (EnvironmentFactory) processEngine;
		EnvironmentImpl env = environmentFactory.openEnvironment();
		TaskImpl task = null;
		DbSession dbSession = (DbSession) env.get(org.jbpm.pvm.internal.session.DbSession.class);
		try {
			task = (TaskImpl)dbSession.get(org.jbpm.pvm.internal.task.TaskImpl.class, Long.valueOf(Long.parseLong(taskId)));
			//1、先解除父级关系
			task.setSuperTask(null);
			task.setExecution(null);
			//2、再完成任务
			task.complete();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			task = (TaskImpl)dbSession.get(org.jbpm.pvm.internal.task.TaskImpl.class, Long.valueOf(Long.parseLong(taskId)));
			if (task != null) {
				task.delete(null);
				dbSession.delete(task);
				task.historyTaskDelete(null);
			}
			if (env != null)
				env.close();
		}
	}
	
	private List<Map<String, String>> getMapListsFromXml(String xml) {
		List<Map<String, String>> list = new ArrayList<Map<String, String>>();
		try {
			Element root = DocumentHelper.parseText(xml).getRootElement();
			for (Element elem : (List<Element>) root.elements()) {
				Map<String, String> map = new HashMap<String, String>();
				String type = elem.getQName().getName();
				map.put("type", type);
				for (Attribute attr: (List<Attribute>) elem.attributes()) {
					map.put(attr.getName(), attr.getValue());
				}
				list.add(map);
			}
		} catch (Exception ex) {
			logger.error(ex.getMessage());
		}
		return list;
	}

	/**
	 * 查看当前任务是否已经结束
	 * 
	 * @param piId
	 * @return
	 */
	protected boolean isProcessInstanceEnd(String piId) {
		HistoryProcessInstance hpi = historyService
				.createHistoryProcessInstanceQuery().processInstanceId(piId)
				.uniqueResult();
		if (hpi != null) {// 检查当前的流程是否已经结束
			String endActivityName = ((HistoryProcessInstanceImpl) hpi)
					.getEndActivityName();
			if (endActivityName != null) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 创建新的任务
	 * 
	 * @param parentTaskId
	 *            父任务 ID
	 * @param assignIds
	 *            任务执行人IDs
	 * @param variables 
	 */
	public void newTask(String parentTaskId, String assignIds, Map variables) {
		TaskServiceImpl taskServiceImpl = (TaskServiceImpl) taskService;
		Task parentTask = taskServiceImpl.getTask(parentTaskId);

		if (assignIds != null) {
			String[] userIds = assignIds.split("[,]");
			for (int i = 0; i < userIds.length; i++) {
				String name="";
				TaskImpl task = (TaskImpl) taskServiceImpl.newTask(parentTaskId);
				task.setAssignee(userIds[i]);
				
				task.setDescription(parentTask.getDescription());
				
				task.setActivityName(parentTask.getName());
				
//				String isForkFlow = (String) variables.get("isForkFlow");
//				if("true".equals(isForkFlow)){
//					long dbid_=0l;
//					ExecutionImpl impl = (ExecutionImpl)getProcessInstanceByExeId(parentTask.getExecutionId());
//					for(ExecutionImpl exe : impl.getExecutions()){
//						if(exe.getActivityName().equals(task.getActivityName())&&exe.getDbid()>dbid_){
//							dbid_=exe.getDbid();
//							task.setExecution(exe);
//							name=exe.getName();
//						}
//					}	
//					task.setActivityName(parentTask.getName());
//					task.setName(parentTask.getName()+"-"+name+"-"+(i+1));
//				}else{
				task.setExecution(getProcessInstanceByExeId(parentTask.getExecutionId()));
				//设置JBPM_Task表中的流程实例ID
				ExecutionImpl executionImpl = (ExecutionImpl)getProcessInstanceByExeId(parentTask.getExecutionId());
				task.setExecution(executionImpl);
				task.setName(parentTask.getName()+"-"+(i+1));
//				}
				// 保存
				taskServiceImpl.saveTask(task);
				
				// taskService.assignTask(task.getId(), userIds[i]);
				// 为该任务指派审批人
				// taskService.assignTask(task.getId(), assign.getUserId());
				// taskService.addTaskParticipatingUser(task.getId(),upIds.toString(),Participation.CANDIDATE);
				// taskService.addTaskParticipatingGroup(task.getId(),
				// assign.getRoleId(), Participation.CANDIDATE);
			}
		}
	}

	/**
	 * 
	 * 执行下一步的流程，对于非任务节点
	 * 
	 * @param id
	 *            processInstanceId
	 * @param transitionName
	 * @param variables
	 */
	public void signalProcess(String executionId, String transitionName,
			Map<String, Object> variables) {

		executionService.setVariables(executionId, variables);
		executionService.signalExecutionById(executionId, transitionName);
	}

	public void endProcessInstance(String piId) {
		ExecutionService executionService = processEngine.getExecutionService();
		executionService.endProcessInstance(piId, Execution.STATE_ENDED);
	}

	public void initJbpmDbid() {
		EnvironmentFactory environmentFactory = (EnvironmentFactory)this.processEngine;
	    EnvironmentImpl env = environmentFactory.openEnvironment();
	    try{
	      Session session = (Session)env.get(Session.class);
	      long lastId = PropertyImpl.getMaxDbid(session);
	      
	      long nextId = DatabaseDbidGenerator.getDbidGenerator().getNextId();
	      if (nextId < lastId)
	      {
	        DatabaseDbidGenerator dbidGenerator = 
	          (DatabaseDbidGenerator)EnvironmentImpl.getFromCurrent(DatabaseDbidGenerator.class, false);
	        PropertyImpl.initializeNextDbid(session);
	        dbidGenerator.initialize();
	      }
	    }
	    finally
	    {
	      env.close();
	    }
	}
}
