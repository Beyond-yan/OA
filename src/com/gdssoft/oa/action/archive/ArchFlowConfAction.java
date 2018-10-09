package com.gdssoft.oa.action.archive;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;
import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import java.lang.reflect.Type;

import com.gdssoft.oa.model.archive.ArchFlowConf;
import com.gdssoft.oa.service.archive.ArchFlowConfService;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;


/**
 * 
 * @author 
 *
 */
public class ArchFlowConfAction extends BaseAction{
	@Resource
	private ArchFlowConfService archFlowConfService;
	private ArchFlowConf archFlowConf;
	
	private Long configId;

	public Long getConfigId() {
		return configId;
	}

	public void setConfigId(Long configId) {
		this.configId = configId;
	}

	public ArchFlowConf getArchFlowConf() {
		return archFlowConf;
	}

	public void setArchFlowConf(ArchFlowConf archFlowConf) {
		this.archFlowConf = archFlowConf;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<ArchFlowConf> list= archFlowConfService.getAll(filter);
		
		Type type=new TypeToken<List<ArchFlowConf>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
		Gson gson=new Gson();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	/**
	 * 批量删除
	 * @return
	 */
	public String multiDel(){
		
		String[]ids=getRequest().getParameterValues("ids");
		if(ids!=null){
			for(String id:ids){
				archFlowConfService.remove(new Long(id));
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
//		ArchFlowConf archFlowConf=archFlowConfService.get(configId);
//		
//		Gson gson=new Gson();
//		//将数据转成JSON格式
//		StringBuffer sb = new StringBuffer("{success:true,data:");
//		sb.append(gson.toJson(archFlowConf));
//		sb.append("}");
//		setJsonString(sb.toString());
		ArchFlowConf sendFlowConf=archFlowConfService.getByFlowType(ArchFlowConf.ARCH_SEND_TYPE);
		ArchFlowConf recFlowConf=archFlowConfService.getByFlowType(ArchFlowConf.ARCH_REC_TYPE);
		StringBuffer sb=new StringBuffer("{success:true,data:");
		if(sendFlowConf!=null){
			sb.append("{'sendProcessId':'"+sendFlowConf.getProcessDefId()+"','sendProcessName':'"+sendFlowConf.getProcessName()+"'");		
		}else{
			sb.append("{'sendProcessId':'','sendProcessName':''");
		}
		if(recFlowConf!=null){
			sb.append(",'recProcessId':'"+recFlowConf.getProcessDefId()+"','recProcessName':'"+recFlowConf.getProcessName()+"'}}");
		}else{
			sb.append(",'recProcessId':'','recProcessName':''}}");
		}
		setJsonString(sb.toString());
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		String sendId=getRequest().getParameter("sendProcessId");
		String sendName=getRequest().getParameter("sendProcessName");
		String recId=getRequest().getParameter("recProcessId");
		String recName=getRequest().getParameter("recProcessName");
		if(StringUtils.isNotEmpty(sendId)&&StringUtils.isNotEmpty(sendName)){
			archFlowConf=archFlowConfService.getByFlowType(ArchFlowConf.ARCH_SEND_TYPE);
			if(archFlowConf==null){
				archFlowConf=new ArchFlowConf();
				archFlowConf.setArchType(ArchFlowConf.ARCH_SEND_TYPE);
			}
			archFlowConf.setProcessDefId(new Long(sendId));
			archFlowConf.setProcessName(sendName);
			archFlowConfService.save(archFlowConf);
		}
		if(StringUtils.isNotEmpty(recId)&&StringUtils.isNotEmpty(recName)){
			archFlowConf=archFlowConfService.getByFlowType(ArchFlowConf.ARCH_REC_TYPE);
			if(archFlowConf==null){
				archFlowConf=new ArchFlowConf();
				archFlowConf.setArchType(ArchFlowConf.ARCH_REC_TYPE);
			}
			archFlowConf.setProcessDefId(new Long(recId));
			archFlowConf.setProcessName(recName);
			archFlowConfService.save(archFlowConf);
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}
	
	/**
	 * 获取流程
	 */
	public String getFlow(){
		String type=getRequest().getParameter("flowType");
		StringBuffer sb=new StringBuffer();
		if(type.equals(ArchFlowConf.ARCH_SEND_TYPE.toString())){
			archFlowConf=archFlowConfService.getByFlowType(ArchFlowConf.ARCH_SEND_TYPE);
		}
		else{
			archFlowConf=archFlowConfService.getByFlowType(ArchFlowConf.ARCH_REC_TYPE);
		}
		if(archFlowConf!=null){
			sb.append("{success:true,defId:").append(archFlowConf.getProcessDefId())
			.append(",processName:'").append(archFlowConf.getProcessName()).append("'}");
		}else{
			sb.append("{success:false,'message':'你还没设定流程'}");
		}
		setJsonString(sb.toString());
		return SUCCESS;
	}
}
