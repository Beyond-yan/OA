package com.gdssoft.oa.model.flow;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
//import org.jbpm.pvm.internal.model.Transition;
import org.jbpm.api.model.Transition;

/**
 * 
 * @author csx
 *
 */
public class Transform {
	private static final Log logger=LogFactory.getLog(Transform.class);
	/**
	 * 转换器名称 
	 */
	private String name;
	
	/**
	 * 目标名称
	 */
	private String destination;
	
	private String nodeType;
	
	/**
	 * 源名称
	 */
	private String source;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDestination() {
		return destination;
	}

	public void setDestination(String destination) {
		this.destination = destination;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}
	
	
	public Transform() {
		
	}
	
	public Transform(Transition jbpmtran){
		try{
			this.name=jbpmtran.getName();
			this.source=jbpmtran.getSource().getName();
			this.nodeType=jbpmtran.getSource().getType();
			this.destination=jbpmtran.getDestination().getName();
		}catch(Exception ex){
			logger.error(ex.getMessage());
		}
	}

	public String getNodeType() {
		return nodeType;
	}

	public void setNodeType(String nodeType) {
		this.nodeType = nodeType;
	}
	
	
}
