package com.gdssoft.oa.service.flow;

import java.util.List;
import java.util.Map;
import java.util.Set;




import org.jbpm.api.ProcessDefinition;
import org.jbpm.api.ProcessInstance;
import org.jbpm.api.task.Task;
//import org.jbpm.pvm.internal.model.Transition;
import org.jbpm.api.model.Transition;

import com.gdssoft.oa.action.flow.FlowRunInfo;
import com.gdssoft.oa.model.flow.ProDefinition;
import com.gdssoft.core.jbpm.jpdl.Node;
/**
 * Jbpm操作接口
 * @author csx
 *
 */
public interface JbpmService {
	
	/**
	 * 通过ExecutionId取得processInstance
	 * @param executionId
	 * @return
	 */
	public ProcessInstance getProcessInstanceByExeId(String executionId);

	/**
	 * 取得任务节点
	 * @param defId
	 * @return
	 */
	public List<Node>getTaskNodesByDefId(Long defId);
	
	/**
	 * 取得任务定义
	 * @param taskId
	 * @return
	 */
	public Task getTaskById(String taskId);
	
	/**
	 * 任务指定执行
	 * @param taskId
	 * @param userId
	 */
	public void assignTask(String taskId,String userId);
	
	/**
	 * 加载需要填写表单的流程节点
	 * @param defId
	 * @return
	 */
	public List<Node>getFormNodes(Long defId);
	
	/**
	 * 按流程key取得流程定义
	 * @return
	 */
	public ProDefinition getProDefinitionByKey(String processKey);
	
	/**
	 * 通过任务取得流程节义
	 * @param taskId
	 * @return
	 */
	public ProcessDefinition getProcessDefinitionByTaskId(String taskId);
	
	/**
	 * 按流程的Key取得流程定义
	 * @param processKey
	 * @return
	 */
	public ProcessDefinition getProcessDefinitionByKey(String processKey);
	
	/**
	 * 
	 * @param defId
	 * @return
	 */
	public String getDefinitionXmlByDefId(Long defId);
	/**
	 * 按发布id取得流程定义
	 * @return
	 */
	public String getDefinitionXmlByDpId(String deployId);
	/**
	 * 按流程实例ID取得流程定义
	 * @param piId
	 * @return
	 */
	public String getDefinitionXmlByPiId(String piId);
	
	/**
	 * 按流程执行的id取得流程定义
	 * @param exeId
	 * @return
	 */
	public String getDefinitionXmlByExeId(String exeId);
	
	/**
	 * 取得流程实例
	 * @param piId
	 * @return
	 */
	public ProcessInstance getProcessInstance(String piId);
	
	/**
	 * 按任务id取得流程实例
	 * @param taskId
	 * @return
	 */
	public ProcessInstance getProcessInstanceByTaskId(String taskId);
	
	
	/**
	 * 删除流程定义，同时也删除该流程的相关数据，包括启动的实例，表单等相关的数据
	 * @param defId
	 */
	public void doUnDeployProDefinition(Long defId);
	
	/**
	 * 发布或更新流程定义
	 * @param proDefinition
	 * @return
	 */
	public ProDefinition saveOrUpdateDeploy(ProDefinition proDefinition);
	
	/**
	 * 启动工作流，并返回流程实例id
	 * @param deployId
	 * @param variables
	 * @return
	 */
	public String startProcess(String deployId,Map variables);
	
	
	/**
	 * 启动工作流，并返回流程实例id
	 * @param deployId
	 * @param variables
	 * @return
	 */
	public String startProcess(String deployId,FlowRunInfo runInfo);
	
	/**
	 * 显示某个流程当前任务对应的所有出口
	 * @param piId
	 * @return
	 */
	 public List<Transition> getTransitionsForSignalProcess(String piId);
	 
	 /**
	  * 按任务节点取得所有出口
	  * @param taskId
	  * @return
	  */
	 public List<Transition> getTransitionsByTaskId(String taskId);
	 
//	 /**
//	  * 取得任务对应的所有跳转名称
//	  */
//	 public Set<String> getTransitionsByTaskId(Long taskId);
	 
	 
	 /**
	  * 从当前的任务节点，可以跳至流程的任何任务节点，可以创建任何跳转的连接
	  * @param taskId
	  * @return
	  */
	 public List<Transition> getFreeTransitionsByTaskId(String taskId);
	 
	/**
	 * 取到节点类型
	 * 
	 * @param xml
	 * @param nodeName
	 * @return
	 */
	public String getNodeType(String xml, String nodeName);
	
	/**
	 * 取得开始节点名称
	 * @param proDefinition
	 * @return
	 */
	public String getStartNodeName(ProDefinition proDefinition);
	
	/**
	 * 通过流程定义实例ID取得流程对应的XML
	 * @param piId
	 * @return
	 */
	public String getProcessDefintionXMLByPiId(String piId);
	public List<Node> getValidNodesFromXml(String xml);
	/**
	  * 取得某流程实例对应的任务列表
	  * @param piId
	  * @return
	  */
	 public List<Task> getTasksByPiId(String piId);
	 
	/**
	 * 完成任务，
	 * @param taskId 任务ID
	 * @param transitionName　下一步的转换名称
	 * @param 目标节点名称      加上该参数，目的是为了自由跳转的流程，因为对于两个不存在的连接的节点，需要动态创建连接才能进行跳转。
	 * @param variables　流程的附加数据
	 */
	 public ProcessInstance completeTask(String taskId,String transitionName,String destName,Map variables,Boolean freeJump,Long formId);
	 
	/**
	 * 执行普通任务节点下一步
	 * @param executionId
	 * @param transitionName
	 * @param variables
	 */
	public void signalProcess(String executionId, String transitionName, Map<String, Object> variables);
	
	/**
	 * 结束流程实例
	 * @param piId
	 */
	public void endProcessInstance(String piId);
	
	
	public List<Transition> getNodeOuterTrans(ProcessDefinition definition,String nodeName);
	
	public void initJbpmDbid();
	
}
