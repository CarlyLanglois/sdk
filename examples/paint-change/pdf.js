import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
//import { Button } from 'muicss/react';
import JSPDF from 'jspdf';
import Mark from 'markup-js';

/** Component to export map elements to pdf,
 *  from GeoMoose 3 print component.
 */
class PDFExporter extends React.PureComponent {

  addText(doc, def) {
      // these are the subsitution strings for the map text elements
      const date = new Date();
      const subst_dict = {
          title: this.props.mapName === 'default' ? 'Boundless Web SDK Map' : this.props.mapName,
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
      };

      // def needs to define: x, y, text
      const defaults = {
          size: 13,
          color: [0, 0, 0],
          font: 'Arial',
          fontStyle: 'normal'
      };

      // create a new font definition object based on
      //  the combination of the defaults and the definition
      //  passed in by the user.
      const full_def = Object.assign({}, defaults, def);

      // set the size
      doc.setFontSize(full_def.size);
      // the color
      doc.setTextColor(full_def.color[0], full_def.color[1], full_def.color[2]);
      // and the font face.
      doc.setFont(full_def.font, full_def.fontStyle);
      // then mark the face.
      doc.text(full_def.x, full_def.y, Mark.up(full_def.text, subst_dict));
  }

  addImage(doc, def) {
      // optionally scale the image to fit the space.
      if(def.width && def.height) {
          doc.addImage(def.image_data, def.x, def.y, def.width, def.height);
      } else {
          doc.addImage(def.image_data, def.x, def.y);
      }

  }

  addMapImage(doc, def) {
      // this is not a smart component and it doesn't need to be,
      //  so sniffing the state for the current image is just fine.
      const image_data = document.getElementsByTagName('canvas')[0].toDataURL();
      this.addImage(doc, Object.assign({}, def, {image_data: image_data}));
  }

  addDrawing(doc, def) {
      // determine the style string
      let style = 'S';
      if(def.filled) {
          style = 'DF';
      }

      // set the colors
      const stroke = def.stroke ? def.stroke : [0, 0, 0];
      const fill = def.fill ? def.fill : [255, 255, 255];
      doc.setDrawColor(stroke[0], stroke[1], stroke[2]);
      doc.setFillColor(fill[0], fill[1], fill[2]);

      // set the stroke width
      const stroke_width = def.strokeWidth ? def.strokeWidth : 1;
      doc.setLineWidth(stroke_width);

      // draw the shape.
      if(def.type === 'rect') {
          doc.rect(def.x, def.y, def.width, def.height, style);
      }
  }

  toPDF(layout) {
    // new PDF document
    const doc = new JSPDF(layout.orientation, layout.units, layout.page);

    // add some fonts
    doc.addFont('Arial', 'Arial', 'normal');
    doc.addFont('Arial-Bold', 'Arial', 'bold');

    // iterate through the elements of the layout
    //  and place them in the document.
    for(const element of layout.elements) {
      switch(element.type) {
        case 'text':
          this.addText(doc, element);
          break;
        case 'map':
          this.addMapImage(doc, element);
          break;
        case 'rect':
          this.addDrawing(doc, element);
          break;
        default:
        // pass, do nothing.
      }
    }

    // kick it back out to the user.
    doc.save('print_' + ((new Date()).getTime()) + '.pdf');
  }

  render() {
    return (
      <button onClick={ () => { this.toPDF(this.props.layout); }}>
        Export As PDF
      </button>
    );
  }
}

PDFExporter.propTypes = {
  /**
   * A print layout is an object with keys such as: label (string),
   * thumbnail (string), width (number), height (number) and an array of elements.
   * Elements are objects with keys such as name (string, optional), type (enum('map', 'text', 'rect'), optional),
   * height (number), width (number), x (number), y (number), font (string),
   * id (string), size (number), grid (object with intervalX, intervalY, annotationEnabled and crs keys).
   */
  //layout: PropTypes.object,
  layout: PropTypes.shape({
    label: PropTypes.string,
    orientation: PropTypes.string,
    page: PropTypes.string,
    units: PropTypes.string,
    thumbnail: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    elements: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.oneOf(['map', 'text', 'rect']),
      height: PropTypes.number,
      width: PropTypes.number,
      x: PropTypes.number,
      y: PropTypes.number,
      font: PropTypes.string,
      fontStyle: PropTypes.string,
      id: PropTypes.string,
      text: PropTypes.string,
      size: PropTypes.number,
    })),
  }),
};

PDFExporter.defaultProps = {
  layout: {
      label: 'Letter - Landscape',
      orientation: 'landscape',
      page: 'letter',
      units: 'in',
      elements: [
          {
              type: 'text',
              size: 18, fontStyle: 'bold',
              x: .5, y: .70, text: '{{title}}'
          },
          {
              type: 'map',
              x: .5, y: .75,
              width: 10, height: 7
          },
          {
              type: 'rect',
              x: .5, y: .75,
              width: 10, height: 7,
              strokeWidth: .01
          },
          {
              type: 'text',
              x: .5, y: 8, text: 'Printed on {{month}} / {{day}} / {{year}}'
          }
      ]
  },
};

function mapStateToProps(state) {
  return {
    mapName: state.map.name,
  }
}

export default connect(mapStateToProps, null)(PDFExporter);
