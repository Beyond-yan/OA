package com.gdssoft.oa.action.flow;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;
import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.oa.model.flow.ProDefinition;
import com.gdssoft.oa.model.flow.ProUserAssign;
import com.gdssoft.oa.service.flow.JbpmService;
import com.gdssoft.oa.service.flow.ProDefinitionService;
import com.gdssoft.oa.service.flow.ProUserAssignService;
import com.google.gson.Gson;
import com.gdssoft.core.jbpm.jpdl.Node;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;


/**
 * 
 * @author csx
 *
 */
public class ProUserAssignAction extends BaseAction{
	@Resource
	private ProUserAssignService proUserAssignService;
	@Resource
	private JbpmService jbpmService;
	@Resource
	private ProDefinitionService proDefinitionService;

	public void setJbpmService(JbpmService jbpmService) {
		this.jbpmService = jbpmService;
	}
	private ProUserAssign proUserAssign;
	
	private Long assignId;

	public Long getAssignId() {
		return assignId;
	}

	public void setAssignId(Long assignId) {
		this.assignId = assignId;
	}

	public ProUserAssign getProUserAssign() {
		return proUserAssign;
	}

	public void setProUserAssign(ProUserAssign proUserAssign) {
		this.proUserAssign = proUserAssign;
	}

	/**
	 * 显示授权的列表
	 */
	public String list(){
		
		Gson gson=new Gson();
		
		String defId = getRequest().getParameter("defId");
		
		ProDefinition proDefinition= proDefinitionService.get(new Long(defId));

		List<Node> nodes = jbpmService.getTaskNodesByDefId(new Long(defId));
		
		List<ProUserAssign> nodesAssignList=proUserAssignService.getByDeployId(proDefinition.getDeployId());
		
		StringBuffer buff = new StringBuffer("{result:[");
		
		for (int i = 0; i < nodes.size(); i++) {
			String nodeName=nodes.get(i).getName();
			buff.append("{activityName:'").append(nodeName).append("',deployId:'" + proDefinition.getDeployId()).append("'");
			for(int j=0;j<nodesAssignList.size();j++){
				ProUserAssign assign=nodesAssignList.get(j);
				if(nodeName.equals(assign.getActivityName())){
					buff.append(",assignId:'").append(gson.toJson(assign.getAssignId()).replace("\"", ""))
					.append("',userId:'").append(assign.getUserId()==null?ContextUtil.getCurrentUserId():assign.getUserId())
					.append("',username:'").append(gson.toJson(assign.getUsername()).replace("\"", ""))
					.append("',roleId:'").append(assign.getRoleId()==null?"":assign.getRoleId())
					.append("',roleName:'").append(gson.toJson(assign.getRoleName()).replace("\"", "")).append("'");
					break;
				}
			}
			buff.append("},");
		}

		if (!nodes.isEmpty()) {
			buff.deleteCharAt(buff.length() - 1);
		}

		buff.append("]}");
		
		setJsonString(buff.toString());
		
		return SUCCESS;
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String get(){
		ProUserAssign proUserAssign=proUserAssignService.get(assignId);
		
		Gson gson=new Gson();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(proUserAssign));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
			String data=getRequest().getParameter("data");
			//logger.info("data:"+data);
			if(StringUtils.isNotEmpty(data)){
				Gson gson=new Gson();
				ProUserAssign[]assigns=gson.fromJson(data, ProUserAssign[].class);
				for(ProUserAssign assign:assigns){
					if(assign.getAssignId()==-1){//若为-1，则代表尚未持久化,主要用于防止自动绑值（gson.fromJson(data, ProUserAssign[].class)）出错;
						assign.setAssignId(null);
					}
					proUserAssignService.save(assign);
				}
			}

		return SUCCESS;
	}
}
