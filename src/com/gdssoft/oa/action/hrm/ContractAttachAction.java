package com.gdssoft.oa.action.hrm;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;
import javax.annotation.Resource;

import java.lang.reflect.Type;

import com.gdssoft.oa.model.hrm.ContractAttach;
import com.gdssoft.oa.service.hrm.ContractAttachService;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;


/**
 * 
 * @author 
 *
 */
public class ContractAttachAction extends BaseAction{
	@Resource
	private ContractAttachService contractAttachService;
	private ContractAttach contractAttach;
	
	private Long fileId;

	public Long getFileId() {
		return fileId;
	}

	public void setFileId(Long fileId) {
		this.fileId = fileId;
	}

	public ContractAttach getContractAttach() {
		return contractAttach;
	}

	public void setContractAttach(ContractAttach contractAttach) {
		this.contractAttach = contractAttach;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<ContractAttach> list= contractAttachService.getAll(filter);
		
		Type type=new TypeToken<List<ContractAttach>>(){}.getType();
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
				contractAttachService.remove(new Long(id));
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
		ContractAttach contractAttach=contractAttachService.get(fileId);
		
		Gson gson=new Gson();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(contractAttach));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		contractAttachService.save(contractAttach);
		setJsonString("{success:true}");
		return SUCCESS;
	}
}
